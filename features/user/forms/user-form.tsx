"user client";

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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { appConfig } from "@/lib/config/app";
import { useForm } from "@tanstack/react-form";
import { useAction, useQuery } from "convex/react";
import { ArrowLeft, Eye, EyeOff, Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  createUserSchema,
  editUserSchema,
  UserProfile,
} from "../schemas/user.schema";
import { SelectOption } from "@/lib/types/common";
import { genderOptions } from "@/lib/constants/common";

interface UserFormProps {
  user?: UserProfile;
  mode: "create" | "edit";
}

export default function UserForm({ user, mode }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const positions = useQuery(api.positions.getPositions);
  const departments = useQuery(api.departments.getDepartments);

  const departmentOptions: SelectOption[] =
    departments?.map((department) => ({
      label: department.name,
      value: department._id,
    })) ?? [];

  const positionOptions: SelectOption[] =
    positions?.map((position) => ({
      label: position.name,
      value: position._id,
    })) ?? [];

  const createUser = useAction(api.users.adminCreateUser);

  const form = useForm({
    defaultValues: {
      employeeId: user?.employeeId ?? "",
      email: user?.email ?? "",
      password: "",
      firstName: user?.firstName ?? "",
      middleName: user?.middleName ?? "",
      lastName: user?.lastName ?? "",
      suffix: user?.suffix ?? "",
      gender: user?.gender ?? "male",
      phoneNumber: user?.phoneNumber ?? "",
      dateOfBirth: user?.dateOfBirth ?? "",
      hireDate: user?.hireDate ?? "",
      departmentId: user?.departmentId ?? "",
      positionId: user?.positionId ?? "",
      role: user?.role ?? "",
      status: user?.status ?? "active",
    },
    validators: {
      onSubmit: mode === "create" ? createUserSchema : editUserSchema,
    },
    onSubmit: async ({ value }) => {
      const parser = mode === "create" ? createUserSchema : editUserSchema;
      const parsedData = parser.parse(value);

      console.table(parsedData);

      try {
        const id = createUser({
          ...parsedData,
          departmentId: parsedData.departmentId
            ? (parsedData.departmentId as Id<"departments">)
            : undefined,
          positionId: parsedData.positionId as Id<"positions">,
        });

        if (await id) {
          toast.success(`You have created an account for ${parsedData.email}.`);
          console.info("New user profile ID: ", id);
          router.push("/users");
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
          toast.error(err.message);
        } else {
          console.error("Unknown error", err);
          toast.error("Something went wrong");
        }
      }
    },
  });

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
          <h1 className="text-2xl font-semibold tracking-tight">Create User</h1>
          <p className="text-muted-foreground text-sm">
            Add a new user to {appConfig.name}
          </p>
        </div>
      </div>

      {/* Form */}
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
                    />
                  )}
                </form.Field>

                {mode === "create" && (
                  <form.Field name="password">
                    {(field) => (
                      <FormTextField
                        field={field}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        required
                        addOnContent={
                          <InputGroupAddon
                            align={"inline-end"}
                            className="pr-1"
                          >
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
                )}

                <form.Field name="role">
                  {(field) => (
                    <FormSelectField
                      field={field}
                      label="Role"
                      placeholder="Select a role"
                      required
                      options={[
                        { label: "Administrator", value: "administrator" },
                        { label: "Normal User", value: "normal_user" },
                      ]}
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
                    />
                  )}
                </form.Field>

                <form.Field name="positionId">
                  {(field) => (
                    <FormSelectField
                      field={field}
                      label="Position"
                      options={positionOptions}
                      loading={!positions}
                      placeholder="Select position"
                      required
                    />
                  )}
                </form.Field>

                <form.Field name="hireDate">
                  {(field) => (
                    <FormDateField
                      field={field}
                      label="Hire Date"
                      placeholder="Select date"
                    />
                  )}
                </form.Field>

                <form.Field name="departmentId">
                  {(field) => (
                    <FormSelectField
                      field={field}
                      label="Department"
                      options={departmentOptions}
                      loading={!departments}
                      placeholder="Select department"
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
                      {mode === "create" ? "Creating ..." : "Saving ..."}
                    </>
                  ) : (
                    <>
                      <Save />
                      {mode === "create" ? "Create User" : "Save Changes"}
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
