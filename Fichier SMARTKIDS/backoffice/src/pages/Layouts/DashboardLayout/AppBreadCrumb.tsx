import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NavLink } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

export default function AppBreadCrumb({
  paths,
}: {
  paths: ({ label: string; path: string } | { label: string; current: true })[];
}) {
  if (!paths.length) {
    return null;
  }

  return (
    <Breadcrumb className="px-4 sm:px-6 mb-4">
      <BreadcrumbList>
        {paths.map((item) => (
          <Fragment key={item.label}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                {"current" in item ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <NavLink to={item.path}>{item.label}</NavLink>
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {!("current" in item) ? <BreadcrumbSeparator /> : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
