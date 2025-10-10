import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const usersData = [
  { id: "U001", name: "Admin User", email: "admin@zentroverse.com", role: "Administrator", permissions: { view: true, edit: true, delete: true, approve: true, reports: true } },
  { id: "U002", name: "Service Manager", email: "manager@zentroverse.com", role: "Manager", permissions: { view: true, edit: true, delete: false, approve: true, reports: true } },
];

export default function WorkshopProfile() {
  const [users, setUsers] = useState(usersData);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("User added successfully!");
    setIsUserDialogOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast.success("User removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Workshop Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your workshop information</p>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile Info</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workshopName">Workshop Name</Label>
                  <Input id="workshopName" defaultValue="ZENTROVERSE Auto Workshop" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input id="ownerName" defaultValue="Rajesh Mehta" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input id="contact" defaultValue="9876543210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="contact@zentroverse.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input id="gstin" defaultValue="27AABCU9603R1ZV" />
              </div>
              <div className="flex justify-end">
                <Button className="gap-2" onClick={() => toast.success("Profile updated!")}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Workshop Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" defaultValue="123 Main Road, Andheri East" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="Mumbai" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" defaultValue="Maharashtra" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" defaultValue="400069" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="gap-2" onClick={() => toast.success("Address updated!")}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Users & Roles</CardTitle>
              <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Create a new user account with permissions</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="userName">Full Name</Label>
                      <Input id="userName" placeholder="Enter name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userEmail">Email</Label>
                      <Input id="userEmail" type="email" placeholder="user@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userRole">Role</Label>
                      <Input id="userRole" placeholder="e.g., Manager" required />
                    </div>
                    <div className="space-y-3">
                      <Label>Permissions</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">View</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Edit</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Delete</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Approve</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Reports</span>
                        <Switch />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">Add User</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">{user.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => toast.info("Editing user")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-2 pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Switch checked={user.permissions.view} />
                        <span className="text-xs">View</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={user.permissions.edit} />
                        <span className="text-xs">Edit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={user.permissions.delete} />
                        <span className="text-xs">Delete</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={user.permissions.approve} />
                        <span className="text-xs">Approve</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={user.permissions.reports} />
                        <span className="text-xs">Reports</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="text-lg font-bold text-foreground">Professional</p>
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">Valid Until</p>
                  <p className="text-lg font-bold text-foreground">Dec 31, 2024</p>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Features</p>
                <ul className="mt-2 space-y-1 text-sm text-foreground">
                  <li>✓ Unlimited Job Cards</li>
                  <li>✓ Advanced Reports</li>
                  <li>✓ CRM & Reminders</li>
                  <li>✓ Multi-user Access</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
