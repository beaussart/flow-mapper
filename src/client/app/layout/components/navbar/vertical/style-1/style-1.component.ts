import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Select } from '@ngxs/store';
import { AuthState } from '../../../../../state/auth.state';

@Component({
  selector: 'navbar-vertical-style-1',
  templateUrl: './style-1.component.html',
  styleUrls: ['./style-1.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarVerticalStyle1Component implements OnInit, OnDestroy {
  fuseConfig: any;
  navigation: any;

  @Select(AuthState.userName)
  userName$: Observable<string>;

  @Select(AuthState.userEmail)
  userEmail$: Observable<string>;

  @Select(AuthState.userPicture)
  userPicture$: Observable<string>;

  // Private
  private fusePerfectScrollbar: FusePerfectScrollbarDirective;
  private unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FuseConfigService} fuseConfigService
   * @param {FuseNavigationService} fuseNavigationService
   * @param {FuseSidebarService} fuseSidebarService
   * @param {Router} router
   */
  constructor(
    private fuseConfigService: FuseConfigService,
    private fuseNavigationService: FuseNavigationService,
    private fuseSidebarService: FuseSidebarService,
    private router: Router,
  ) {
    // Set the private defaults
    this.unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  // Directive
  @ViewChild(FusePerfectScrollbarDirective)
  set directive(theDirective: FusePerfectScrollbarDirective) {
    if (!theDirective) {
      return;
    }

    this.fusePerfectScrollbar = theDirective;

    // Update the scrollbar on collapsable item toggle
    this.fuseNavigationService.onItemCollapseToggled
      .pipe(
        delay(500),
        takeUntil(this.unsubscribeAll),
      )
      .subscribe(() => {
        this.fusePerfectScrollbar.update();
      });

    // Scroll to the active item position
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        take(1),
      )
      .subscribe(() => {
        setTimeout(() => {
          const activeNavItem: any = document.querySelector(
            'navbar .nav-link.active',
          );

          if (activeNavItem) {
            const activeItemOffsetTop = activeNavItem.offsetTop,
              activeItemOffsetParentTop = activeNavItem.offsetParent.offsetTop,
              scrollDistance =
                activeItemOffsetTop - activeItemOffsetParentTop - 48 * 3 - 168;

            this.fusePerfectScrollbar.scrollToTop(scrollDistance);
          }
        });
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.unsubscribeAll),
      )
      .subscribe(() => {
        if (this.fuseSidebarService.getSidebar('navbar')) {
          this.fuseSidebarService.getSidebar('navbar').close();
        }
      });

    // Subscribe to the config changes
    this.fuseConfigService.config
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(config => {
        this.fuseConfig = config;
      });

    // Get current navigation
    this.fuseNavigationService.onNavigationChanged
      .pipe(
        filter(value => value !== null),
        takeUntil(this.unsubscribeAll),
      )
      .subscribe(() => {
        this.navigation = this.fuseNavigationService.getCurrentNavigation();
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
   * Toggle sidebar opened status
   */
  toggleSidebarOpened(): void {
    this.fuseSidebarService.getSidebar('navbar').toggleOpen();
  }

  /**
   * Toggle sidebar folded status
   */
  toggleSidebarFolded(): void {
    this.fuseSidebarService.getSidebar('navbar').toggleFold();
  }
}
