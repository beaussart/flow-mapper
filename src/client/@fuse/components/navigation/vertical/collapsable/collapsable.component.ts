import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { merge, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { FuseNavigationItem } from '../../../../types/index';
import { fuseAnimations } from '../../../../animations/index';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Component({
  selector: 'fuse-nav-vertical-collapsable',
  templateUrl: './collapsable.component.html',
  styleUrls: ['./collapsable.component.scss'],
  animations: fuseAnimations,
})
export class FuseNavVerticalCollapsableComponent implements OnInit, OnDestroy {
  @Input()
  item: FuseNavigationItem;

  @HostBinding('class')
  classes = 'nav-collapsable nav-item';

  @HostBinding('class.open')
  public isOpen = false;

  // Private
  private unsubscribeAll: Subject<any>;

  /**
   * Constructor
   */
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private fuseNavigationService: FuseNavigationService,
    private router: Router,
  ) {
    // Set the private defaults
    this.unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Listen for router events
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.unsubscribeAll),
      )
      .subscribe((event: NavigationEnd) => {
        // Check if the url can be found in
        // one of the children of this item
        if (this.isUrlInChildren(this.item, event.urlAfterRedirects)) {
          this.expand();
        } else {
          this.collapse();
        }
      });

    // Listen for collapsing of any navigation item
    this.fuseNavigationService.onItemCollapsed
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(clickedItem => {
        if (clickedItem && clickedItem.children) {
          // Check if the clicked item is one
          // of the children of this item
          if (this.isChildrenOf(this.item, clickedItem)) {
            return;
          }

          // Check if the url can be found in
          // one of the children of this item
          if (this.isUrlInChildren(this.item, this.router.url)) {
            return;
          }

          // If the clicked item is not this item, collapse...
          if (this.item !== clickedItem) {
            this.collapse();
          }
        }
      });

    // Check if the url can be found in
    // one of the children of this item
    if (this.isUrlInChildren(this.item, this.router.url)) {
      this.expand();
    } else {
      this.collapse();
    }

    // Subscribe to navigation item
    merge(
      this.fuseNavigationService.onNavigationItemAdded,
      this.fuseNavigationService.onNavigationItemUpdated,
      this.fuseNavigationService.onNavigationItemRemoved,
    )
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => {
        // Mark for check
        this.changeDetectorRef.markForCheck();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle collapse
   *
   * @param ev event
   */
  toggleOpen(ev): void {
    ev.preventDefault();

    this.isOpen = !this.isOpen;

    // Navigation collapse toggled...
    this.fuseNavigationService.onItemCollapsed.next(this.item);
    this.fuseNavigationService.onItemCollapseToggled.next();
  }

  /**
   * Expand the collapsable navigation
   */
  expand(): void {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;

    // Mark for check
    this.changeDetectorRef.markForCheck();

    this.fuseNavigationService.onItemCollapseToggled.next();
  }

  /**
   * Collapse the collapsable navigation
   */
  collapse(): void {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;

    // Mark for check
    this.changeDetectorRef.markForCheck();

    this.fuseNavigationService.onItemCollapseToggled.next();
  }

  /**
   * Check if the given parent has the
   * given item in one of its children
   *
   * @param parent the parent element
   * @param item te item in the collapse
   * @returns if the item is children of
   */
  isChildrenOf(parent, item): boolean {
    if (!parent.children) {
      return false;
    }

    if (parent.children.indexOf(item) !== -1) {
      return true;
    }

    for (const children of parent.children) {
      if (children.children) {
        return this.isChildrenOf(children, item);
      }
    }
  }

  /**
   * Check if the given url can be found
   * in one of the given parent's children
   *
   * @param parent the parent element
   * @param url the url to find
   * @returns if the url is in children
   */
  isUrlInChildren(parent, url): boolean {
    if (!parent.children) {
      return false;
    }

    for (const child of parent.children) {
      if (child.children) {
        if (this.isUrlInChildren(child, url)) {
          return true;
        }
      }

      if (child.url === url || url.includes(child.url)) {
        return true;
      }
    }

    return false;
  }
}
