import { Button, buttonVariants } from "@coss/ui/components/button";
import {
  Card,
  CardFrame,
  CardFrameDescription,
  CardFrameFooter,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from "@coss/ui/components/card";
import { ActivityIcon } from "lucide-react";
import Link from "next/link";
import { NewWebhookFormFields } from "./new-webhook-form-fields";
import { WebhookTestSection } from "./webhook-test-section";
import {
  AppHeader,
  AppHeaderContent,
  AppHeaderDescription,
} from "@/components/app/app-header";

export default function NewWebhookPage() {
  return (
    <>
      <AppHeader>
        <AppHeaderContent title="New webhook">
          <AppHeaderDescription>
            Receive meeting data in real-time when something happens in Cal.com.
          </AppHeaderDescription>
        </AppHeaderContent>
      </AppHeader>
      <div className="flex flex-col gap-4">
        <CardFrame>
          <Card className="rounded-b-none!">
            <CardPanel>
              <NewWebhookFormFields />
            </CardPanel>
          </Card>
          <CardFrameFooter className="flex justify-end gap-2">
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/settings/developer/webhooks"
            >
              Cancel
            </Link>
            <Button>Save</Button>
          </CardFrameFooter>
        </CardFrame>

        <CardFrame>
          <CardFrameHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardFrameTitle>Webhook test</CardFrameTitle>
                <CardFrameDescription>
                  Please ping test before creating.
                </CardFrameDescription>
              </div>
              <Button size="sm" variant="outline">
                <ActivityIcon />
                Ping test
              </Button>
            </div>
          </CardFrameHeader>
          <Card>
            <CardPanel>
              <WebhookTestSection />
            </CardPanel>
          </Card>
        </CardFrame>
      </div>
    </>
  );
}
