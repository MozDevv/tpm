/**{
      "year": 2013,
      "january": 12000,
      "february": 14000,
      "march": 144100,
      "april": 128480,
      "may": 126000,
      "june": 323670,
      "july": 323779,
      "august": 33700,
      "september": 33700,
      "october": 33700,
      "november": 33700,
      "december": 33700,
      "total_anual_salary": 1240529,
      "intrest": 186079.35,
      "startDate": "2013-01-31T00:00:00Z",
      "endDate": "2013-12-31T00:00:00Z"
    }, */
'use client';
import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { ArrowForwardIos } from '@mui/icons-material';
import { menuItems } from '../baseComponents/data';
import { usePathname } from 'next/navigation';

const CustomBreadcrumbsList = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Helper function to find breadcrumb steps based on the path
  const findBreadcrumbSteps = (items, path) => {
    for (const item of items) {
      if (item.path === path) {
        return [{ label: item.title, path: item.path }];
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.path === path) {
            return [
              { label: item.title, path: item.path },
              { label: child.title, path: child.path },
            ];
          }
          if (child.subChildren) {
            for (const subChild of child.subChildren) {
              if (subChild.path === path) {
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

  const breadcrumbSteps = findBreadcrumbSteps(menuItems, pathname);

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
          color="inherit"
          href={step.path}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation(step.path);
          }}
        >
          {step.label}
        </Link>
      ))}
      {breadcrumbSteps.length > 0 && (
        <Typography color="textPrimary">
          {breadcrumbSteps[breadcrumbSteps.length - 1].label}
        </Typography>
      )}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbsList;
