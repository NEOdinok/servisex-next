import { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components";

export interface Props {
  content?: ReactNode | string;
  title: string;
}

export const InfoBlock = ({ content, title }: Props) => {
  return (
    <Card className="border border-foreground">
      <CardHeader>
        <CardTitle className="uppercase">{title}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};
