/**
 * Dashboard Home Page
 * Shows overview, quick actions, recent orders
 */

"use client";

import { Card, Row, Col, Button, Empty, Skeleton, Space } from "antd";
import { PlusOutlined, CalendarOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useGetReservations } from "@/hooks/reservation/useGetReservations";
import { useGetPets } from "@/hooks/pet/useGetPets";

export default function DashboardPage() {
  const { pets, isLoading: petsLoading } = useGetPets();
  const { reservations, isLoading: reservationsLoading } = useGetReservations({
    status: "CONFIRMED",
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl border-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome to PetCare! 🐾</h2>
            <p className="text-blue-100">
              Premium pet care services at your doorstep with instant booking and payment
            </p>
          </div>
          <div className="text-6xl">✨</div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable className="text-center">
            <div className="text-4xl mb-3">✂️</div>
            <h3 className="font-semibold mb-2">Book Service</h3>
            <Link href="/dashboard/booking">
              <Button type="primary" block icon={<PlusOutlined />}>
                New Booking
              </Button>
            </Link>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable className="text-center">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="font-semibold mb-2">My Orders</h3>
            <Link href="/dashboard/orders">
              <Button block icon={<CalendarOutlined />}>
                View Orders
              </Button>
            </Link>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card hoverable className="text-center">
            <div className="text-4xl mb-3">🐾</div>
            <h3 className="font-semibold mb-2">My Pets</h3>
            <Link href="/dashboard/pets">
              <Button block>
                Manage Pets
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>

      {/* My Pets Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">My Pets</h3>
          <Link href="/dashboard/pets">
            <Button type="link">View All</Button>
          </Link>
        </div>
        {petsLoading ? (
          <Skeleton active />
        ) : pets.length === 0 ? (
          <Empty description="No pets registered" />
        ) : (
          <Row gutter={16}>
            {pets.slice(0, 3).map((pet) => (
              <Col key={pet.id} xs={24} sm={12} md={8}>
                <Card>
                  <div className="text-center">
                    <div className="text-5xl mb-2">🐾</div>
                    <h4 className="font-semibold text-lg">{pet.name}</h4>
                    <p className="text-sm text-gray-600">
                      {pet.type} • {pet.breed}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Age: {pet.age} years</p>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Upcoming Orders */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Upcoming Services</h3>
          <Link href="/dashboard/orders">
            <Button type="link">View All</Button>
          </Link>
        </div>
        {reservationsLoading ? (
          <Skeleton active />
        ) : reservations.length === 0 ? (
          <Empty
            description="No upcoming services"
            style={{ marginTop: 50 }}
          />
        ) : (
          <Space direction="vertical" className="w-full">
            {reservations.slice(0, 3).map((order) => (
              <Card key={order.id}>
                <Row gutter={16}>
                  <Col xs={24} sm={8}>
                    <div>
                      <p className="text-xs text-gray-600">Pet</p>
                      <p className="font-semibold">{order.pet?.name || "Unknown"}</p>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div>
                      <p className="text-xs text-gray-600">Date</p>
                      <p className="font-semibold">{order.scheduledDate}</p>
                    </div>
                  </Col>
                  <Col xs={24} sm={8} className="text-right">
                    <p className="text-xs text-gray-600 mb-1">Status</p>
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      {order.status}
                    </span>
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        )}
      </div>
    </div>
  );
}
