'use client';
import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowForwardIos } from '@mui/icons-material';
import { adminItems, menuItems } from '../pensionsComponents/sidebar/Sidebar';

const CustomBreadcrumbsList = () => {
  const router = useRouter();
  const pathname = usePathname();

  const findBreadcrumbSteps = (items, pathname) => {
    console.log('current path: ', pathname);
    for (const item of items) {
      // Compare the path, not title
      if (item.path === pathname) {
        return [{ label: item.title, path: item.path }];
      }
      if (item.children) {
        for (const child of item.children) {
          // Compare the path of the child
          if (child.path === pathname) {
            return [
              { label: item.title, path: item.path },
              { label: child.title, path: child.path },
            ];
          }
          if (child.subChildren) {
            for (const subChild of child.subChildren) {
              // Compare the path of the sub-child
              if (subChild.path === pathname) {
                return [
                  { label: item.title, path: item.path },
                  { label: child.title, path: child.path },
                  { label: subChild.title, path: subChild.path },
                ];
              }
            }
          }
        }
      }
    }
    return [];
  };

  const breadcrumbSteps = findBreadcrumbSteps(
    [...menuItems, ...adminItems],
    pathname
  );

  const handleNavigation = (path) => {
    if (path) {
      router.push(path);
    }
  };

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={
        <Typography
          variant="body2"
          style={{
            color: '#6D6D6D',
            fontSize: '13px',
          }}
        >
          <ArrowForwardIos
            sx={{
              fontSize: '12px',
              color: '#6D6D6D',
            }}
          />
        </Typography>
      }
      sx={{ marginTop: 4, marginLeft: 2 }}
    >
      {breadcrumbSteps.map((step, index) => (
        <Link
          key={index}
          color={pathname === step.path ? 'primary' : '#6D6D6D'}
          style={{
            fontWeight: pathname === step.path ? 'bold' : '600',
            padding: pathname === step.path ? '5px 10px' : '0',
            fontSize: '15px',
            borderRadius: '5px',
            textDecoration: 'none',
            cursor: step.path ? 'pointer' : 'default',
          }}
          onClick={() => handleNavigation(step.path)}
        >
          {step.label}
        </Link>
      ))}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbsList;
