"user client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createUserSchema,
  editUserSchema,
  UserProfile,
} from "../schemas/user.schema";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

interface UserFormProps {
  user?: UserProfile;
  mode: "create" | "edit";
}

export default function UserForm({ user, mode }: UserFormProps) {
  const router = useRouter();

  const positions = useQuery(api.positions.getPositions);
  const departments = useQuery(api.departments.getDepartments);

  const createUser = useMutation(api.users.createUserByAdmin);

  const form = useForm({
    defaultValues: {
      employeeId: user?.employeeId ?? "",
      email: user?.email ?? "",
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
      status: user?.role ?? "invited",
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
          toast.success(`You have invited ${parsedData.email}.`);
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
            Add a new user to Performa
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
        <div className="flex flex-col max-w-3xl gap-6">
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
              <FieldGroup className="grid grid-cols-1 sm:grid-cols-2">
                <form.Field
                  name="email"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Email <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="off"
                          placeholder="example@tpsdxb.com"
                        />
                        <FieldDescription>
                          An invitation email will be sent to this address so
                          the user can set their password.
                        </FieldDescription>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="role"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Role <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="administrator">
                              Administrator
                            </SelectItem>
                            <SelectItem value="user">Normal User</SelectItem>
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
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
                <form.Field
                  name="firstName"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="lg:col-span-2">
                        <FieldLabel htmlFor={field.name}>
                          First Name <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="middleName"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="lg:col-span-2">
                        <FieldLabel htmlFor={field.name}>
                          Middle Name
                        </FieldLabel>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="lastName"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="lg:col-span-2">
                        <FieldLabel htmlFor={field.name}>
                          Last Name <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="suffix"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Suffix</FieldLabel>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="ex. Jr., Ph.D., III"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="gender"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectGroup>
                              <SelectLabel>Gender</SelectLabel>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="phoneNumber"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="md:col-span-2">
                        <FieldLabel htmlFor={field.name}>
                          Phone Number
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            maxLength={9}
                            inputMode="numeric"
                          />
                          <InputGroupAddon>
                            <InputGroupText>+971</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="dateOfBirth"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    const selectedDate = field.state.value
                      ? new Date(field.state.value)
                      : undefined;
                    return (
                      <Field data-invalid={isInvalid} className="md:col-span-2">
                        <FieldLabel htmlFor={field.name}>
                          Date of Birth
                        </FieldLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal truncate",
                                !selectedDate && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2" />
                              {selectedDate
                                ? format(selectedDate, "PPP")
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              autoFocus
                              onSelect={(date) => {
                                if (!date) {
                                  field.handleChange("");
                                  return;
                                }

                                field.handleChange(date.toISOString());
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
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
                <form.Field
                  name="employeeId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Employee ID{" "}
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="off"
                          placeholder="1234"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="hireDate"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    const selectedDate = field.state.value
                      ? new Date(field.state.value)
                      : undefined;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Hire Date</FieldLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal truncate",
                                !selectedDate && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2" />
                              {selectedDate
                                ? format(selectedDate, "PPP")
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              autoFocus
                              onSelect={(date) => {
                                if (!date) {
                                  field.handleChange("");
                                  return;
                                }

                                field.handleChange(date.toISOString());
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="positionId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Position <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          disabled={!positions}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
                            <SelectValue
                              placeholder={
                                !positions
                                  ? "Loading items ..."
                                  : "Select position"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectGroup>
                              <SelectLabel>Position</SelectLabel>
                              {!positions ? (
                                <SelectItem value="loading" disabled>
                                  Loading...
                                </SelectItem>
                              ) : positions.length === 0 ? (
                                <SelectItem value="empty" disabled>
                                  No items found
                                </SelectItem>
                              ) : (
                                positions.map((item) => (
                                  <SelectItem key={item._id} value={item._id}>
                                    {item.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <form.Field
                  name="departmentId"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Department</FieldLabel>
                        <div className="flex gap-2">
                          <Select
                            name={field.name}
                            value={field.state.value}
                            onValueChange={field.handleChange}
                            disabled={!departments}
                          >
                            <SelectTrigger
                              id={field.name}
                              aria-invalid={isInvalid}
                              className="flex-1"
                            >
                              <SelectValue
                                placeholder={
                                  !departments
                                    ? "Loading items ..."
                                    : "Select department"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectGroup>
                                <SelectLabel>Department</SelectLabel>
                                {!departments ? (
                                  <SelectItem value="loading" disabled>
                                    Loading...
                                  </SelectItem>
                                ) : departments.length === 0 ? (
                                  <SelectItem value="empty" disabled>
                                    No items found
                                  </SelectItem>
                                ) : (
                                  departments.map((item) => (
                                    <SelectItem key={item._id} value={item._id}>
                                      {item.name}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => field.handleChange("")}
                            disabled={!field.state.value}
                          >
                            <X />
                          </Button>
                        </div>

                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
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
