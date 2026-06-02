/**
 * Dashboard Layout
 * Main app layout with sidebar and header
 * Uses Ant Design for navigation
 */

import { Layout, Menu } from "antd";
import { HomeOutlined, CalendarOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Sider, Content, Header } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: <Link href="/dashboard">Home</Link>,
    },
    {
      key: "2",
      icon: <PlusOutlined />,
      label: <Link href="/dashboard/booking">New Booking</Link>,
    },
    {
      key: "3",
      icon: <CalendarOutlined />,
      label: <Link href="/dashboard/orders">My Orders</Link>,
    },
    {
      key: "4",
      icon: <UserOutlined />,
      label: <Link href="/dashboard/profile">Profile</Link>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        breakpoint="lg"
        collapsedWidth={0}
        className="bg-gradient-to-b from-blue-600 to-purple-700"
        theme="dark"
      >
        <div className="p-4 text-white text-center text-2xl font-bold mb-8">
          <span className="text-3xl">🐾</span>
          <p className="text-sm mt-2">PetCare</p>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          className="bg-transparent border-0"
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        {/* Top Header */}
        <Header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">PetCare Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, User! 👋</span>
          </div>
        </Header>

        {/* Page Content */}
        <Content className="bg-gray-50">
          <div className="p-6">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
