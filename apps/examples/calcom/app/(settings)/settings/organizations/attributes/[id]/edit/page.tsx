import { Button, buttonVariants } from "@coss/ui/components/button";
import {
  Card,
  CardFrame,
  CardFrameFooter,
  CardPanel,
} from "@coss/ui/components/card";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { NewAttributeFormFields } from "../../new/new-attribute-form-fields";
import {
  AppHeader,
  AppHeaderContent,
  AppHeaderDescription,
} from "@/components/app/app-header";

export default async function EditAttributePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <AppHeader>
        <div className="flex min-w-0 items-start gap-3">
          <Link
            aria-label="Go back"
            className={buttonVariants({ size: "icon-sm", variant: "ghost" })}
            href="/settings/organizations/attributes"
          >
            <ArrowLeftIcon aria-hidden="true" />
          </Link>
          <AppHeaderContent title="Edit attribute">
            <AppHeaderDescription>
              Update a custom attribute for your team members.
            </AppHeaderDescription>
          </AppHeaderContent>
        </div>
      </AppHeader>
      <CardFrame>
        <Card>
          <CardPanel>
            <NewAttributeFormFields key={id} />
          </CardPanel>
        </Card>
        <CardFrameFooter className="flex justify-end">
          <Button type="button">Save</Button>
        </CardFrameFooter>
      </CardFrame>
    </>
  );
}
