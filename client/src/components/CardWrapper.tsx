import React from "react";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription, CardAction } from "./ui/card";
import { Link } from "react-router-dom"; // for React.js routing

interface CardWrapperProps {
  label?: string;
  title: string;
  description?: string;
  backButtonHref?: string;
  backButtonLabel?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  action?: React.ReactNode;
}

const CardWrapper = ({
  label,
  title,
  description,
  backButtonHref,
  backButtonLabel,
  children,
  footer,
  action,
}: CardWrapperProps) => {
  return (
    <Card className="w-full max-w-md sm:max-w-sm lg:max-w-md mx-auto mt-10 p-6 shadow-md rounded-lg">
      <CardHeader>
        {label && <span className="text-sm text-gray-500">{label}</span>}
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>

      <CardContent>{children}</CardContent>

      <CardFooter className="flex justify-between items-center">
        {backButtonHref && backButtonLabel && (
          <Link to={backButtonHref} className="text-blue-500 hover:underline">
            {backButtonLabel}
          </Link>
        )}
        {footer}
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
