import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components";

export interface Props {
  content?: ReactNode;
  title: string;
}

export const InfoBlock = ({ content, title }: Props) => {
  return (
    <Card className="border border-foreground">
      <CardHeader>
        <CardTitle className="uppercasew">{title}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};
