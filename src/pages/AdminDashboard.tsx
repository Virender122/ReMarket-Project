import AdminLayout from "@/components/AdminLayout";
import { adminStats, userActivities } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, DollarSign, TrendingUp, MessageCircle, Flag, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const statCards = [
  { label: "Total Users", value: "12,847", change: "+48 today", trend: "up", icon: Users, color: "text-primary" },
  { label: "Active Listings", value: "3,421", change: "+12.5%", trend: "up", icon: ShoppingBag, color: "text-info" },
  { label: "Total Sales", value: "8,934", change: "+8.3%", trend: "up", icon: DollarSign, color: "text-success" },
  { label: "Revenue", value: "$245.6K", change: "+15.2%", trend: "up", icon: TrendingUp, color: "text-accent" },
  { label: "Active Chats", value: "234", change: "-3.1%", trend: "down", icon: MessageCircle, color: "text-primary" },
  { label: "Reports", value: "7", change: "+2 new", trend: "up", icon: Flag, color: "text-destructive" },
];

const activityIcons: Record<string, string> = {
  purchase: "gradient-primary",
  listing: "bg-info",
  chat: "bg-accent",
  report: "bg-destructive",
  signup: "bg-success",
};

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Monitor all marketplace activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="shadow-card hover:shadow-elevated transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-heading font-bold text-card-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-3">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-success" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-destructive" />
                    )}
                    <span className={cn("text-xs font-medium", stat.trend === "up" ? "text-success" : "text-destructive")}>
                      {stat.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Activity Feed & Users */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg">Live Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {userActivities.map((activity, i) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className={cn("h-2 w-2 rounded-full flex-shrink-0", activityIcons[activity.type])} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-card-foreground">
                        <span className="font-semibold">{activity.user}</span>
                        {" "}{activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{activity.details}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg">Top Sellers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "John D.", sales: 47, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
                  { name: "Sarah K.", sales: 38, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
                  { name: "Emma L.", sales: 32, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
                  { name: "Mike R.", sales: 28, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
                  { name: "Alex P.", sales: 21, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
                ].map((seller, i) => (
                  <div key={seller.name} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-4">{i + 1}</span>
                    <img src={seller.avatar} alt={seller.name} className="h-8 w-8 rounded-full bg-muted" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">{seller.name}</p>
                      <p className="text-xs text-muted-foreground">{seller.sales} sales</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{seller.sales}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-lg">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">User</th>
                    <th className="pb-3 font-medium text-muted-foreground">Email</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Listings</th>
                    <th className="pb-3 font-medium text-muted-foreground">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {[
                    { name: "John D.", email: "john@email.com", status: "Active", listings: 12, joined: "Jan 15, 2024", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
                    { name: "Sarah K.", email: "sarah@email.com", status: "Active", listings: 8, joined: "Feb 3, 2024", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
                    { name: "Mike R.", email: "mike@email.com", status: "Suspended", listings: 3, joined: "Mar 12, 2024", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" },
                    { name: "Emma L.", email: "emma@email.com", status: "Active", listings: 15, joined: "Jan 28, 2024", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" },
                    { name: "Alex P.", email: "alex@email.com", status: "Active", listings: 6, joined: "Apr 1, 2024", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
                  ].map((user) => (
                    <tr key={user.email} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <img src={user.avatar} alt={user.name} className="h-7 w-7 rounded-full bg-muted" />
                          <span className="font-medium text-card-foreground">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{user.email}</td>
                      <td className="py-3">
                        <Badge variant={user.status === "Active" ? "default" : "destructive"} className={user.status === "Active" ? "gradient-primary border-0 text-primary-foreground" : ""}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">{user.listings}</td>
                      <td className="py-3 text-muted-foreground">{user.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
