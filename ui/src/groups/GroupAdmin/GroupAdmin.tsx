import cn from 'classnames';
import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import CaretLeftIcon from '@/components/icons/CaretLeftIcon';
import { useIsMobile } from '@/logic/useMedia';
import { useAmAdmin, useRouteGroup } from '@/state/groups/groups';

export default function GroupAdmin() {
  const flag = useRouteGroup();
  const isAdmin = useAmAdmin(flag);
  const isMobile = useIsMobile();

  return (
    <section className="w-full overflow-y-scroll">
      {isMobile ? (
        <div className="px-2 py-1">
          <Link
            to="../"
            className="default-focus inline-flex items-center rounded-lg p-2 text-xl font-medium text-gray-800 hover:bg-gray-50"
          >
            <CaretLeftIcon className="mr-4 h-6 w-6 text-gray-600" />
            Group Info
          </Link>
        </div>
      ) : null}
      <div className="m-4 sm:my-5 sm:mx-8">
        {isAdmin ? (
          <header className="card mb-4 p-2">
            <nav>
              <ul className="flex items-center font-semibold text-gray-400">
                <li>
                  <NavLink
                    to="../info"
                    end
                    className={({ isActive }) =>
                      cn(
                        'default-focus inline-block rounded-md p-2 hover:bg-gray-50',
                        isActive && 'text-gray-800'
                      )
                    }
                  >
                    Group Info
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="members"
                    className={({ isActive }) =>
                      cn(
                        'default-focus inline-block rounded-md p-2 hover:bg-gray-50',
                        isActive && 'text-gray-800'
                      )
                    }
                  >
                    Members
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="channels"
                    className={({ isActive }) =>
                      cn(
                        'default-focus inline-block rounded-md p-2 hover:bg-gray-50',
                        isActive && 'text-gray-800'
                      )
                    }
                  >
                    Channels
                  </NavLink>
                </li>
              </ul>
            </nav>
          </header>
        ) : null}
        <Outlet />
      </div>
    </section>
  );
}
