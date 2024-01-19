'use client'

import {
  faGithub,
  faLinkedin,
  faSpotify,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  DropdownMenu,
  DropdownMenuItemProps,
} from '@keadex/keadex-ui-kit/cross'
import { kebabCase } from 'change-case'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PropsWithChildren, useEffect, useState } from 'react'
import keadexLogo from '../../../public/img/keadex-logo.png'
import { useTranslation } from '../../app/i18n/client'
import ROUTES, {
  ABOUT_ME,
  DOCS,
  HOME,
  PROJECTS,
  PROJECTS_ROUTES,
} from '../../core/routes'

export type HeaderProps = {
  lang: string
}

export default function Header(props: PropsWithChildren<HeaderProps>) {
  const { lang } = props

  const [scrollActive, setScrollActive] = useState(false)
  const [menuCollapsed, setMenuCollapsed] = useState(true)
  const pathname = usePathname()
  const { t } = useTranslation(lang)

  const menuItems: DropdownMenuItemProps[] = [
    {
      id: 'dropdown-nav-projects',
      label: (
        <span
          className={`${
            pathname?.startsWith(`/${lang}${ROUTES[PROJECTS].path}`)
              ? ' active'
              : ''
          }`}
        >
          {t('common.projects')}
        </span>
      ),
      isHeaderMenuItem: true,
      buttonClassName: 'h-full',
      subMenuItems: PROJECTS_ROUTES.map((projectRoute) => {
        return {
          id: `dropdown-nav-project_${kebabCase(
            projectRoute.name.toLowerCase(),
          )}`,
          label: (
            <Link
              href={projectRoute.path}
              className={`${
                pathname?.endsWith(projectRoute.path) ? ' sub-active' : ''
              }`}
            >
              {projectRoute.name}
            </Link>
          ),
        }
      }),
    },
  ]

  useEffect(() => {
    const scrollListener = () => {
      setScrollActive(window.scrollY > 20)
    }
    window.addEventListener('scroll', scrollListener)

    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [])

  return (
    // <!-- Main navigation container -->
    <header
      className={`fixed top-0 w-full z-30 transition-all duration-500 ${
        scrollActive || !menuCollapsed
          ? ' shadow-md backdrop-blur-md bg-dark-primary/60'
          : ' bg-transparent'
      }`}
    >
      <nav
        className="header__nav relative flex w-full flex-nowrap items-center justify-between lg:flex-wrap lg:justify-start py-4"
        data-te-navbar-ref
      >
        <div className="flex w-full flex-wrap items-center justify-between">
          <div className="flex items-center mx-0 ml-8 mr-8 py-2">
            <Link href={ROUTES[HOME].path}>
              <Image
                className="h-6 w-auto"
                src={keadexLogo}
                alt="Keadex Logo"
              />
            </Link>
          </div>

          {/* Hamburger button for mobile view */}
          <button
            className={`mr-8 block border-0 bg-transparent text-neutral-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden header__menu-button ${
              !menuCollapsed ? 'header__menu-button--open' : ''
            }`}
            type="button"
            data-te-collapse-init
            data-te-target="#navbarSupportedContent14"
            aria-controls="navbarSupportedContent14"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setMenuCollapsed((prev) => !prev)}
          >
            <span>Menu</span>
          </button>

          {/* Collapsible navbar container */}
          <div
            className="!visible mt-2 hidden flex-grow basis-[100%] items-center lg:mt-0 lg:!flex lg:basis-auto"
            id="navbarSupportedContent14"
            data-te-collapse-item
          >
            {/* Left links */}
            <ul
              className="list-style-none mr-auto flex flex-col pl-0 lg:flex-row lg:table"
              data-te-navbar-nav-ref
            >
              <li>
                <DropdownMenu
                  menuItemsProps={menuItems}
                  className="inline-block align-middle h-full"
                />
              </li>
              <li>
                <Link
                  href={ROUTES[DOCS].path}
                  className={`${
                    pathname?.endsWith(ROUTES[DOCS].path) ? ' active' : ''
                  }`}
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES[ABOUT_ME].path}
                  className={`${
                    pathname?.endsWith(ROUTES[ABOUT_ME].path) ? ' active' : ''
                  }`}
                >
                  {t('common.about_me')}
                </Link>
              </li>
              <li className="text-center lg:text-right">
                <Link href="https://github.com/keadex/keadex" target="_blank">
                  <FontAwesomeIcon icon={faGithub} className="text-xl" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/giacomosimmi"
                  target="_blank"
                  className="!mx-3 lg:!mx-0"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
                </Link>
                <Link
                  href="http://open.spotify.com/user/jacksimmi"
                  target="_blank"
                  className="mr-auto lg:!mr-8"
                >
                  <FontAwesomeIcon icon={faSpotify} className="text-xl" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
