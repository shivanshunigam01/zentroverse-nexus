import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Lock,
  Camera,
  Save,
  Edit2,
  Eye,
  EyeOff,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
} from "@/redux/services/userProfileSlice";
import { UserProfile } from "@/types/user";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    designation: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // API Calls
  const { data: profileData, isLoading: isProfileLoading } =
    useGetUserProfileQuery();

  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const authUser = useSelector(
    (state: { app: { user: UserProfile | null } }) => state.app.user
  );

  // Initialize form data when profile loads
  useEffect(() => {
    if (profileData) {
      const user = profileData;
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        designation: user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
      });
    }
  }, [profileData]);

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        designation: formData.designation,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      }).unwrap();

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Failed to update profile");
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      }).unwrap();

      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } };
      toast.error(apiError?.data?.message || "Failed to change password");
    }
  };

  const user = profileData || authUser;
  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U";

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal information and account security
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="border-border bg-gradient-to-r from-card via-card to-secondary/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={user?.profileImage} alt={user?.name} />
                <AvatarFallback className="text-lg font-semibold bg-primary/20 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white hover:bg-primary/90 transition-colors shadow-lg opacity-0 group-hover:opacity-100">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">
                {user?.name}
              </h2>
              <p className="text-muted-foreground font-medium">{user?.designation || 'No designation set'}</p>
              <div className="flex gap-6 mt-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-2 rounded-lg">
                  <Mail className="h-4 w-4 text-primary" />
                  {user?.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-2 rounded-lg">
                  <Phone className="h-4 w-4 text-primary" />
                  {user?.phoneNumber || 'Not provided'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="personal" className="flex gap-2">
            <User className="h-4 w-4" />
            <span>Personal Info</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex gap-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (isEditing) {
                      handleUpdateProfile();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  disabled={isUpdating}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {/* Basic Information Section */}
              <div>
                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                    <div className="h-1 w-1 bg-primary rounded-full"></div>
                    Basic Information
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your essential profile information
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6 pl-3">
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">
                      Full Name
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`${
                        !isEditing
                          ? "bg-muted border-transparent cursor-not-allowed"
                          : "border-border"
                      }`}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Email</Label>
                    <Input
                      value={formData.email}
                      disabled
                      className="bg-muted border-transparent cursor-not-allowed"
                      placeholder="Email address"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">
                      Phone Number
                    </Label>
                    <Input
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className={`${
                        !isEditing
                          ? "bg-muted border-transparent cursor-not-allowed"
                          : "border-border"
                      }`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">
                      Designation
                    </Label>
                    <Input
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          designation: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className={`${
                        !isEditing
                          ? "bg-muted border-transparent cursor-not-allowed"
                          : "border-border"
                      }`}
                      placeholder="Enter your designation"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="border-t border-border pt-8">
                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                    <div className="h-1 w-1 bg-primary rounded-full"></div>
                    Address Information
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your residential address details
                  </p>
                </div>
                <div className="space-y-6 pl-3">
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">
                      Street Address
                    </Label>
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`${
                        !isEditing
                          ? "bg-muted border-transparent cursor-not-allowed"
                          : "border-border"
                      }`}
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">
                        City
                      </Label>
                      <Input
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        disabled={!isEditing}
                        className={`${
                          !isEditing
                            ? "bg-muted border-transparent cursor-not-allowed"
                            : "border-border"
                        }`}
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">
                        State
                      </Label>
                      <Input
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        disabled={!isEditing}
                        className={`${
                          !isEditing
                            ? "bg-muted border-transparent cursor-not-allowed"
                            : "border-border"
                        }`}
                        placeholder="Enter state"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">
                        Zip Code
                      </Label>
                      <Input
                        value={formData.zipCode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            zipCode: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className={`${
                          !isEditing
                            ? "bg-muted border-transparent cursor-not-allowed"
                            : "border-border"
                        }`}
                        placeholder="Enter zip code"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Change Password */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="flex gap-2 items-center">
                <Lock className="h-5 w-5 text-primary" />
                Change Password
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Update your password to keep your account secure
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label className="text-foreground font-medium">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Enter your current password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <div className="space-y-2 mb-4">
                  <Label className="text-foreground font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter new password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="text-sm text-muted-foreground bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mt-6 space-y-2">
                  <p className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-blue-500 rounded-full"></span>
                    Password Requirements
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>At least 8 characters long</li>
                    <li>Mix of uppercase and lowercase letters</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={handleChangePassword}
                disabled={
                  isChangingPassword ||
                  !passwordData.currentPassword ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword
                }
                className="w-full mt-6"
                size="lg"
              >
                {isChangingPassword ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
