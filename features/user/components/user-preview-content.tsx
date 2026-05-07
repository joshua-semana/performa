import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getAvatarColor } from "@/lib/theme/avatar";
import { getStatusColor } from "@/lib/theme/status";
import { capitalize, cn, formatDate, formatPhoneNumber } from "@/lib/utils";
import { UserInfoItem } from "./user-info-item";
import {
  BriefcaseBusiness,
  Building2,
  Cake,
  CalendarCheck,
  IdCardLanyard,
  Mail,
  Phone,
  VenusAndMars,
} from "lucide-react";
import { UserProfileRow } from "./columns";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface UserPreviewContentProps {
  user: UserProfileRow;
  isMobile?: boolean;
  fullName: string;
  router: AppRouterInstance;
}

export function UserPreviewContent({
  user,
  isMobile,
  fullName,
  router,
}: UserPreviewContentProps) {
  const initials = user.firstName[0] + user.lastName[0];

  return (
    <div className="no-scrollbar overflow-y-auto px-4 space-y-4 mb-4">
      <Card>
        <CardContent className="flex flex-col gap-6">
          <div className="flex gap-4 items-center min-w-0">
            <Avatar className="size-14 shrink-0">
              <AvatarFallback
                className={cn(getAvatarColor(initials), "text-lg")}
              >
                {initials.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex justify-between w-full gap-2 min-w-0">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <p className="font-medium text-lg truncate">{fullName}</p>
                <div className="flex gap-1">
                  <Badge
                    className={cn(
                      getStatusColor(user.status),
                      "capitalize rounded-sm",
                    )}
                  >
                    {user.status}
                  </Badge>
                  <Badge
                    className="capitalize rounded-sm"
                    variant={"secondary"}
                  >
                    {capitalize(user.role)}
                  </Badge>
                </div>
              </div>
              <Button
                variant={"secondary"}
                type="button"
                onClick={() => router.push(`/users/${user._id}/edit`)}
                className={cn(
                  "text-sm sm:text-xs cursor-pointer p-2 h-7 tracking-wide hidden",
                  !isMobile && "flex",
                )}
              >
                Edit
              </Button>
            </div>
          </div>
          {isMobile && (
            <Button variant={"secondary"} type="button">
              Edit User
            </Button>
          )}
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground text-xs">CONTACT INFORMATION</p>
            <UserInfoItem Icon={Mail} title="Email" content={user.email} />
            <UserInfoItem
              Icon={Phone}
              title="Phone Number"
              content={formatPhoneNumber(user.phoneNumber)}
            />
            <p className="text-muted-foreground text-xs">WORK INFORMATION</p>
            <UserInfoItem
              Icon={BriefcaseBusiness}
              title="Position"
              content={user.positionName}
            />
            <UserInfoItem
              Icon={Building2}
              title="Department"
              content={user.departmentName}
            />
            <p className="text-muted-foreground text-xs">
              PERSONAL INFORMATION
            </p>
            <div className="grid grid-cols-2 gap-4">
              <UserInfoItem
                Icon={IdCardLanyard}
                title="Employee ID"
                content={user.employeeId}
              />
              <UserInfoItem
                Icon={VenusAndMars}
                title="Gender"
                content={capitalize(user.gender)}
              />
              <UserInfoItem
                Icon={Cake}
                title="Birthday"
                content={formatDate(user.dateOfBirth, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              />
              <UserInfoItem
                Icon={CalendarCheck}
                title="Hire Date"
                content={formatDate(user.hireDate, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start">
          <p className="text-muted-foreground text-xs">
            User created on{" "}
            <strong>
              {formatDate(user._creationTime, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </strong>
          </p>
          <p className="text-muted-foreground text-xs">
            Last update on{" "}
            <strong>
              {formatDate(user.updatedAt, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </strong>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
