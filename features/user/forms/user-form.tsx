"use client";

import ErrorState from "@/components/error-state";
import { FormDateField } from "@/components/form-date-field";
import { FormSelectField } from "@/components/form-select-field";
import { FormTextField } from "@/components/form-text-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { InputGroupAddon, InputGroupText } from "@/components/ui/input-group";
import { api } from "@/convex/_generated/api";
import { appConfig } from "@/lib/config/app";
import { genderOptions, roleOptions } from "@/lib/constants/common";
import { SelectOption } from "@/lib/types/common";
import { useForm } from "@tanstack/react-form";
import { useAction, useMutation, useQuery } from "convex/react";
import { ArrowLeft, Eye, EyeOff, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  createUserSchema,
  editUserSchema,
  statusSchema,
  UserProfile,
} from "../schemas/user.schema";
import { submitUserForm } from "./submit-form";

interface UserFormProps {
  id?: string;
  mode: "edit" | "create";
}

export default function UserForm({ id, mode }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isCreate = mode === "create";
  const pageTitle = isCreate ? "Create New user" : "Edit User";
  const pageDescription = isCreate
    ? `Add a new user to ${appConfig.name}`
    : "Update user account details";

  const userProfile = useQuery(
    api.userProfiles.getProfileByID,
    id ? { userProfileId: id } : "skip",
  );

  const isLoading = !isCreate && userProfile === undefined;

  const router = useRouter();
  const positions = useQuery(api.positions.getPositions);
  const departments = useQuery(api.departments.getDepartments);
  const updateUserProfile = useMutation(api.userProfiles.updateUserProfile);
  const createUser = useAction(api.users.adminCreateUser);
  const updateUserPassword = useAction(api.users.updateUserPassword);

  const user = useMemo<UserProfile | undefined | null>(() => {
    if (userProfile === undefined) return undefined;
    if (userProfile === null) return null;

    return {
      userId: String(userProfile._id),
      employeeId: userProfile.employeeId ?? "",
      email: userProfile.email ?? "",
      firstName: userProfile.firstName ?? "",
      middleName: userProfile.middleName ?? "",
      lastName: userProfile.lastName ?? "",
      suffix: userProfile.suffix ?? "",
      gender: userProfile.gender ?? "male",
      phoneNumber: userProfile.phoneNumber ?? "",
      dateOfBirth: userProfile.dateOfBirth ?? "",
      hireDate: userProfile.hireDate ?? "",
      departmentId: userProfile.departmentId ?? "",
      positionId: userProfile.positionId ?? "",
      role: userProfile.role ?? "",
      status: statusSchema.catch("active").parse(userProfile.status),
      password: "",
    };
  }, [userProfile]);

  const positionOptions: SelectOption[] =
    positions?.map((position) => ({
      label: position.name,
      value: position._id,
    })) ?? [];

  const departmentOptions: SelectOption[] =
    departments?.map((department) => ({
      label: department.name,
      value: department._id,
    })) ?? [];

  const form = useForm({
    defaultValues: {
      employeeId: "",
      email: "",
      password: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      gender: "male",
      phoneNumber: "",
      dateOfBirth: "",
      hireDate: "",
      departmentId: "",
      positionId: "",
      role: "",
      status: "active",
    },
    validators: {
      onSubmit: isCreate ? createUserSchema : editUserSchema,
    },
    onSubmit: async ({ value }) => {
      await submitUserForm({
        isCreate: isCreate,
        user: user,
        value: {
          userId: user?.userId ?? "",
          ...value,
          status: statusSchema.catch("active").parse(value.status),
        },
        router: router,
        createUserHook: createUser,
        updateUserHook: updateUserProfile,
        updatePasswordHook: updateUserPassword,
      });
    },
  });

  useEffect(() => {
    if (!user || isCreate) return;
    form.reset(user);
  }, [user, isCreate, form]);

  if (!isCreate && userProfile === null) {
    return <ErrorState className="flex-1" />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          type="button"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
          <p className="text-muted-foreground text-sm">{pageDescription}</p>
        </div>
      </div>

      <form
        id="form-create-user"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-6 max-w-7xl">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Set up the user’s account identity and role within the
                organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-1 sm:grid-cols-3">
                <form.Field name="email">
                  {(field) => (
                    <FormTextField
                      field={field}
                      label="Email"
                      placeholder="example@tpsdxb.com"
                      type="text"
                      required
                      disabled={!isCreate}
                      showSkeleton={isLoading}
                    />
                  )}
                </form.Field>

                <form.Field name="password">
                  {(field) => (
                    <FormTextField
                      field={field}
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="off"
                      showSkeleton={isLoading}
                      placeholder={isCreate ? "" : "(unchanged)"}
                      addOnContent={
                        <InputGroupAddon align={"inline-end"} className="pr-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </Button>
                        </InputGroupAddon>
                      }
                    />
                  )}
                </form.Field>

                <form.Field name="role">
                  {(field) => (
                    <FormSelectField
                      field={field}
                      label="Role"
                      placeholder="Select a role"
                      required
                      showSkeleton={isLoading}
                      options={roleOptions}
                    />
                  )}
                </form.Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Basic personal details required for employee identification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <form.Field name="firstName">
                  {(field) => (
                    <FormTextField
                      field={field}
                      label="First Name"
                      required
                      type="text"
                      autoComplete="off"
                      showSkeleton={isLoading}
                    />
                  )}
                </form.Field>

                <form.Field name="middleName">
                  {(field) => (
                    <FormTextField
                      field={field}
                      label="Middle Name"
                      type="text"
                      autoComplete="off"
                      showSkeleton={isLoading}
                    />
                  )}
                </form.Field>

                <form.Field name="lastName">
                  {(field) => (
                    <FormTextField
                      field={field}
                      label="Last Name"
                      required
                      type="text"
                      autoComplete="off"
                      showSkeleton={isLoading}
                    />
                  )}
                </form.Field>

                <form.Field name="suffix">
                  {(field) => (
                    <FormTextField
                      field={field}
                      label="Suffix"
                      type="text"
                      autoComplete="off"
                      placeholder="ex. Jr., Ph.D., III"
                      showSkeleton={isLoading}
                    />
                  )}
                </form.Field>

                <form.Field name="gender">
                  {(field) => (
                    <FormSelectField
                      field={field}
                      label="Gender"
                      placeholder="Select a gender"
                      required
                      options={genderOptions}
                      showSkeleton={isLoading}
                    />
                  )}
                </form.Field>
                <form.Field name="phoneNumber">
                  {(field) => (
                    <FormTextField
                      field={field}
                      label="Phone Number"
                      numericOnly
                      autoComplete="off"
                      showSkeleton={isLoading}
                      maxLength={9}
                      addOnContent={
                        <InputGroupAddon>
                          <InputGroupText>+971</InputGroupText>
                        </InputGroupAddon>
                      }
                    />
                  )}
                </form.Field>

                <form.Field name="dateOfBirth">
                  {(field) => (
                    <FormDateField
                      field={field}
                      type="dialog"
                      label="Date of Birth"
                      placeholder="Select date of birth"
                      className="md:col-span-2"
                      showSkeleton={isLoading}
                    />
                  )}
                </form.Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Employee Information */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Information</CardTitle>
              <CardDescription>
                Primary employment data for organizational alignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="grid grid-cols-1 sm:grid-cols-2">
                <form.Field name="employeeId">
                  {(field) => (
                    <FormTextField
                      field={field}
                      label="Employee ID"
                      numericOnly
                      maxLength={5}
                      autoComplete="off"
                      placeholder="1234"
                      required
                      showSkeleton={isLoading}
                    />
                  )}
                </form.Field>

                <form.Field name="hireDate">
                  {(field) => (
                    <FormDateField
                      field={field}
                      label="Hire Date"
                      placeholder="Select date"
                      showSkeleton={isLoading}
                    />
                  )}
                </form.Field>

                <form.Field name="positionId">
                  {(field) => (
                    <FormSelectField
                      field={field}
                      label="Position"
                      options={positionOptions}
                      dataLoading={!positions}
                      placeholder="Select position"
                      required
                      showSkeleton={isLoading}
                    />
                  )}
                </form.Field>

                <form.Field name="departmentId">
                  {(field) => (
                    <FormSelectField
                      field={field}
                      label="Department"
                      options={departmentOptions}
                      dataLoading={!departments}
                      placeholder="Select department"
                      showSkeleton={isLoading}
                    />
                  )}
                </form.Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button onClick={() => router.back()} variant="ghost" type="button">
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      {isCreate ? "Creating ..." : "Saving ..."}
                    </>
                  ) : (
                    <>
                      <Save />
                      {isCreate ? "Create User" : "Save Changes"}
                    </>
                  )}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </div>
      </form>
    </div>
  );
}
