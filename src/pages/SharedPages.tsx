import React, { useState } from "react";
import {
  Card,
  Button,
  Badge,
  DemoBanner,
  StatusBadge,
  Tabs,
  EmptyState,
  Modal,
} from "../components/ui";
import {
  DEMO_ORDERS,
  DEMO_PAYMENTS,
  DEMO_MESSAGES,
  DEMO_NOTIFICATIONS,
  DEMO_FARMER,
} from "../data/demoData";

// ── Orders ────────────────────────────────────────────────────────────────────
export function Orders({ role }: { role: "farmer" | "buyer" }) {
  const [selected, setSelected] = useState<typeof DEMO_ORDERS[0] | null>(null);
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState(DEMO_ORDERS);

  const STATUS_STEPS = [
    "Pending",
    "Accepted",
    "Processing",
    "Ready for Pickup",
    "In Transit",
    "Delivered",
    "Completed",
  ];

  const FILTERS = [
    "All",
    "Active",
    "Pending",
    "Delivered",
    "Completed",
  ];

  const filteredOrders = orders.filter(order => {
    if (filter === "All") return true;

    if (filter === "Active") {
      return !["Delivered", "Completed"].includes(order.status);
    }

    if (filter === "Pending") {
      return order.status === "Pending";
    }

    if (filter === "Delivered") {
      return order.status === "Delivered";
    }

    if (filter === "Completed") {
      return order.status === "Completed";
    }

    return true;
  });

  const updateOrderStatus = (
    orderId: typeof DEMO_ORDERS[0]["id"],
    newStatus: string
  ) => {
    setOrders(current =>
      current.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              updated: "Just now",
              timeline: [
                ...order.timeline,
                `${newStatus} — Just now`,
              ],
            }
          : order
      )
    );

    setSelected(current =>
      current && current.id === orderId
        ? {
            ...current,
            status: newStatus,
            updated: "Just now",
            timeline: [
              ...current.timeline,
              `${newStatus} — Just now`,
            ],
          }
        : current
    );
  };

  const activeCount = orders.filter(
    order => !["Delivered", "Completed"].includes(order.status)
  ).length;

  const completedCount = orders.filter(
    order => order.status === "Completed"
  ).length;

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-4xl mx-auto">
      <DemoBanner />

      <div>
        <h1 className="font-serif text-3xl text-[var(--foreground)]">
          My Orders
        </h1>

        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Track your produce orders from request to completion.
        </p>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="font-mono text-xl font-bold text-[var(--green-mid)]">
            {orders.length}
          </div>

          <div className="text-xs text-[var(--muted-foreground)] mt-1">
            Total Orders
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="font-mono text-xl font-bold text-amber-600">
            {activeCount}
          </div>

          <div className="text-xs text-[var(--muted-foreground)] mt-1">
            Active
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="font-mono text-xl font-bold text-green-600">
            {completedCount}
          </div>

          <div className="text-xs text-[var(--muted-foreground)] mt-1">
            Completed
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map(tab => {
          const active = filter === tab;

          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--green-mid)] text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon="📦"
          title={`No ${filter.toLowerCase()} orders`}
          description="Orders matching this filter will appear here."
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const currentIdx = STATUS_STEPS.indexOf(order.status);

            return (
              <Card
                key={order.id}
                className="p-5 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelected(order)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-semibold text-[var(--muted-foreground)]">
                        #{order.id}
                      </span>

                      <StatusBadge status={order.status} />

                      <Badge variant="demo" size="xs">
                        Demo
                      </Badge>
                    </div>

                    <div className="text-base font-semibold text-[var(--foreground)]">
                      {order.crop} — {order.quantity} {order.unit}
                    </div>

                    <div className="text-sm text-[var(--muted-foreground)]">
                      {role === "farmer"
                        ? `Buyer: ${order.buyer_name}`
                        : `Farmer: ${order.farmer_name}`}
                    </div>

                    <div className="text-xs text-[var(--muted-foreground)] mt-1">
                      Updated: {order.updated}
                    </div>
                  </div>

                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="font-mono text-xl font-bold text-[var(--green-mid)]">
                      ₹{order.total_value.toLocaleString()}
                    </div>

                    <div className="text-xs text-[var(--muted-foreground)]">
                      ₹{order.agreed_price}/quintal
                    </div>
                  </div>
                </div>

                {/* Mini Timeline */}
                <div className="mt-4 flex items-start gap-1 overflow-x-auto pb-1">
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentIdx;

                    return (
                      <React.Fragment key={step}>
                        <div className="flex-shrink-0 flex flex-col items-center gap-1">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                              done
                                ? "bg-[var(--green-mid)] border-[var(--green-mid)] text-white"
                                : "border-[var(--border)] bg-white text-transparent"
                            }`}
                          >
                            ✓
                          </div>

                          <span className="text-[10px] text-[var(--muted-foreground)] whitespace-nowrap hidden sm:block">
                            {step}
                          </span>
                        </div>

                        {i < STATUS_STEPS.length - 1 && (
                          <div
                            className={`flex-1 min-w-4 h-0.5 mt-2 ${
                              i < currentIdx
                                ? "bg-[var(--green-mid)]"
                                : "bg-[var(--border)]"
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order Details Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Order #${selected?.id || ""}`}
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <StatusBadge status={selected.status} />

              <Badge variant="demo">
                Demo Order
              </Badge>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Crop",
                  value: selected.crop,
                },
                {
                  label: "Quantity",
                  value: `${selected.quantity} ${selected.unit}`,
                },
                {
                  label: "Agreed Price",
                  value: `₹${selected.agreed_price}/q`,
                },
                {
                  label: "Total Value",
                  value: `₹${selected.total_value.toLocaleString()}`,
                },
                {
                  label: "Pickup",
                  value: selected.pickup,
                },
                {
                  label: "Delivery",
                  value: selected.delivery,
                },
                {
                  label: role === "farmer" ? "Buyer" : "Farmer",
                  value:
                    role === "farmer"
                      ? selected.buyer_name
                      : selected.farmer_name,
                },
                {
                  label: "Last Updated",
                  value: selected.updated,
                },
              ].map(item => (
                <div
                  key={item.label}
                  className="bg-[var(--muted)] rounded-xl p-3"
                >
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {item.label}
                  </div>

                  <div className="text-sm font-medium text-[var(--foreground)] mt-0.5">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div>
              <div className="text-sm font-semibold text-[var(--foreground)] mb-2">
                Order Timeline
              </div>

              <div className="space-y-2">
                {selected.timeline.map((event, i) => (
                  <div
                    key={`${event}-${i}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-[var(--green-mid)] flex-shrink-0" />

                    <span className="text-[var(--foreground)]">
                      {event}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo Status Actions */}
            {selected.status !== "Completed" && (
              <div className="border-t border-[var(--border)] pt-4">
                <div className="text-sm font-semibold text-[var(--foreground)] mb-2">
                  Demo Order Actions
                </div>

                <div className="flex flex-wrap gap-2">
                  {selected.status === "Pending" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateOrderStatus(selected.id, "Accepted")
                      }
                    >
                      Accept Order
                    </Button>
                  )}

                  {selected.status === "Accepted" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateOrderStatus(selected.id, "Processing")
                      }
                    >
                      Start Processing
                    </Button>
                  )}

                  {selected.status === "Processing" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateOrderStatus(
                          selected.id,
                          "Ready for Pickup"
                        )
                      }
                    >
                      Mark Ready
                    </Button>
                  )}

                  {selected.status === "Ready for Pickup" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateOrderStatus(
                          selected.id,
                          "In Transit"
                        )
                      }
                    >
                      Mark In Transit
                    </Button>
                  )}

                  {selected.status === "In Transit" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateOrderStatus(
                          selected.id,
                          "Delivered"
                        )
                      }
                    >
                      Mark Delivered
                    </Button>
                  )}

                  {selected.status === "Delivered" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateOrderStatus(
                          selected.id,
                          "Completed"
                        )
                      }
                    >
                      Complete Order
                    </Button>
                  )}
                </div>

                <p className="text-xs text-[var(--muted-foreground)] mt-2">
                  Demo action only — status changes are temporary for this
                  session.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── Payments ──────────────────────────────────────────────────────────────────
export function Payments() {
  type Payment = typeof DEMO_PAYMENTS[number];

  const STORAGE_KEY = "agrilink_payment_status";

  const [payments, setPayments] = useState<Payment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return DEMO_PAYMENTS;

      const savedStatuses = JSON.parse(saved) as Record<string, string>;

      return DEMO_PAYMENTS.map(payment => ({
        ...payment,
        status:
          (savedStatuses[payment.id] as Payment["status"]) ||
          payment.status,
      }));
    } catch {
      return DEMO_PAYMENTS;
    }
  });

  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Payment | null>(null);

  const FILTERS = ["All", "Pending", "Completed"];

  const filteredPayments = payments.filter(payment => {
    if (filter === "All") return true;
    return payment.status === filter;
  });

  const pendingAmount = payments
    .filter(payment => payment.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const completedAmount = payments
    .filter(payment => payment.status === "Completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalAmount = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const updatePaymentStatus = (
    paymentId: Payment["id"],
    newStatus: Payment["status"]
  ) => {
    const updatedPayments = payments.map(payment =>
      payment.id === paymentId
        ? { ...payment, status: newStatus }
        : payment
    );

    setPayments(updatedPayments);

    const statusMap = updatedPayments.reduce<Record<string, string>>(
      (acc, payment) => {
        acc[payment.id] = payment.status;
        return acc;
      },
      {}
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(statusMap));

    setSelected(current =>
      current && current.id === paymentId
        ? { ...current, status: newStatus }
        : current
    );
  };

  const formatAmount = (amount: number) =>
    `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-4xl mx-auto">
      <DemoBanner />

      <div>
        <h1 className="font-serif text-3xl text-[var(--foreground)]">
          Payments
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Transaction history and payment status
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="text-xl">🏗️</span>
        <div>
          <div className="text-sm font-semibold text-amber-800">
            Payment Integration Pending
          </div>
          <div className="text-xs text-amber-700">
            Real payment gateway is not connected yet. The transactions below
            are demonstration records.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="font-mono font-bold text-xl text-amber-600">
            {formatAmount(pendingAmount)}
          </div>
          <div className="text-xs text-[var(--muted-foreground)] mt-1">
            Pending
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="font-mono font-bold text-xl text-green-600">
            {formatAmount(completedAmount)}
          </div>
          <div className="text-xs text-[var(--muted-foreground)] mt-1">
            Completed
          </div>
        </Card>

        <Card className="p-4 text-center">
          <div className="font-mono font-bold text-xl text-[var(--foreground)]">
            {formatAmount(totalAmount)}
          </div>
          <div className="text-xs text-[var(--muted-foreground)] mt-1">
            Total
          </div>
        </Card>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map(tab => {
          const active = filter === tab;

          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--green-mid)] text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Transaction History
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {filteredPayments.length} transaction
              {filteredPayments.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Badge variant="demo">
            Demo Transactions
          </Badge>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">
            No {filter.toLowerCase()} payments found.
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {filteredPayments.map(payment => (
              <button
                key={payment.id}
                onClick={() => setSelected(payment)}
                className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-[var(--muted)] transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-[var(--muted-foreground)]">
                      #{payment.order_id}
                    </span>
                    <StatusBadge status={payment.status} />
                    <Badge variant="demo" size="xs">
                      Demo
                    </Badge>
                  </div>

                  <div className="text-sm font-medium text-[var(--foreground)] mt-1 truncate">
                    {payment.crop} · {payment.counterparty}
                  </div>

                  <div className="text-xs text-[var(--muted-foreground)]">
                    {payment.date}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="font-mono font-bold text-[var(--foreground)] text-lg">
                    {formatAmount(payment.amount)}
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">
                    View details →
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Payment ${selected ? `#${selected.id}` : ""}`}
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <StatusBadge status={selected.status} />
              <Badge variant="demo">Demo Payment</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Order ID", value: `#${selected.order_id}` },
                { label: "Amount", value: formatAmount(selected.amount) },
                { label: "Crop", value: selected.crop },
                { label: "Date", value: selected.date },
                { label: "Counterparty", value: selected.counterparty },
                { label: "Status", value: selected.status },
              ].map(item => (
                <div
                  key={item.label}
                  className="bg-[var(--muted)] rounded-xl p-3"
                >
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {item.label}
                  </div>
                  <div className="text-sm font-medium text-[var(--foreground)] mt-0.5">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {selected.status === "Pending" && (
              <div className="border-t border-[var(--border)] pt-4">
                <div className="text-sm font-semibold text-[var(--foreground)] mb-2">
                  Demo Payment Action
                </div>

                <Button
                  fullWidth
                  onClick={() =>
                    updatePaymentStatus(selected.id, "Completed")
                  }
                >
                  ✓ Mark Payment as Completed
                </Button>

                <p className="text-xs text-[var(--muted-foreground)] mt-2">
                  Demo action only. No real money is transferred.
                </p>
              </div>
            )}

            {selected.status === "Completed" && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <div className="text-sm font-semibold text-green-800">
                  ✓ Payment Completed
                </div>
                <div className="text-xs text-green-700 mt-1">
                  This is a simulated payment status for the prototype.
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ── Messages ──────────────────────────────────────────────────────────────────
export function Messages() {
  const [activeConvo, setActiveConvo] = useState(DEMO_MESSAGES[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(DEMO_MESSAGES[0].messages);

  const sendMessage = () => {
    const text = message.trim();
    if (!text) return;

    setMessages(current => [
      ...current,
      { sender: "me", text, time: "Just now" },
    ]);
    setMessage("");
  };

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>
      <div className="w-full lg:w-72 flex-shrink-0 border-r border-[var(--border)] bg-white overflow-y-auto">
        <div className="p-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-[var(--foreground)]">Messages</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2 text-xs text-amber-800">
            ⚠️ Never share OTP, passwords, or sensitive information.
          </div>
        </div>
        {DEMO_MESSAGES.map(convo => (
          <button type="button" key={convo.id} onClick={() => { setActiveConvo(convo); setMessages(convo.messages); }} className={`w-full text-left p-4 border-b border-[var(--border)] hover:bg-[var(--muted)] transition-colors ${activeConvo.id === convo.id ? "bg-[var(--green-pale)]" : ""}`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] font-bold text-sm flex-shrink-0 border border-[var(--border)]">{convo.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--foreground)] truncate">{convo.from}</span>
                  <span className="text-xs text-[var(--muted-foreground)] flex-shrink-0 ml-2">{convo.time}</span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] truncate mt-0.5">{convo.last}</p>
                {convo.unread > 0 && <span className="inline-flex mt-1 items-center justify-center w-4 h-4 bg-red-500 text-white text-xs rounded-full">{convo.unread}</span>}
              </div>
            </div>
            <div className="mt-2 ml-13"><Badge variant="neutral" size="xs">{convo.crop_context}</Badge></div>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col bg-[var(--background)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] font-bold text-sm border border-[var(--border)]">{activeConvo.avatar}</div>
            <div><div className="font-semibold text-[var(--foreground)] text-sm">{activeConvo.from}</div><div className="text-xs text-[var(--muted-foreground)]">{activeConvo.crop_context}</div></div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => window.alert("Conversation reported in demo mode.")}>Report</Button>
            <Button variant="ghost" size="sm" onClick={() => window.alert("Conversation blocked in demo mode.")}>Block</Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${msg.sender === "me" ? "bg-[var(--green-mid)] text-white rounded-br-none" : "bg-white text-[var(--foreground)] rounded-bl-none border border-[var(--border)]"}`}>
                <p>{msg.text}</p><p className={`text-xs mt-1 ${msg.sender === "me" ? "text-white/60" : "text-[var(--muted-foreground)]"}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-[var(--border)] bg-white">
          <div className="flex gap-2">
            <input type="text" placeholder="Type a message..." value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => { if (e.key === "Enter") sendMessage(); }} className="flex-1 border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]" />
            <button type="button" onClick={sendMessage} className="px-4 py-2.5 bg-[var(--green-mid)] text-white rounded-xl hover:bg-[var(--primary)] transition-colors text-sm font-medium">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Notifications ─────────────────────────────────────────────────────────────
export function Notifications() {
  const TYPE_ICONS: Record<string, string> = {
    buyer_match: "🤝",
    price_change: "📊",
    order: "📦",
    ai: "✦",
    market: "🏪",
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-[var(--foreground)]">
          Notifications
        </h1>

        <button className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
          Mark all read
        </button>
      </div>

      <div className="space-y-2">
        {DEMO_NOTIFICATIONS.map(n => (
          <Card
            key={n.id}
            className={`p-4 ${
              !n.read
                ? "border-l-4 border-l-[var(--green-mid)]"
                : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">
                {TYPE_ICONS[n.type] || "🔔"}
              </span>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold text-[var(--foreground)] text-sm">
                    {n.title}
                  </div>

                  <span className="text-xs text-[var(--muted-foreground)] flex-shrink-0">
                    {n.time}
                  </span>
                </div>

                <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
                  {n.body}
                </p>
              </div>

              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-[var(--green-mid)] flex-shrink-0 mt-1.5" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Help & Support ────────────────────────────────────────────────────────────
export function HelpSupport() {
  const CATEGORIES = [
    {
      icon: "🔐",
      title: "Login Problem",
      desc: "Can't access your account",
    },
    {
      icon: "👤",
      title: "Face Verification",
      desc: "Issues with face scan",
    },
    {
      icon: "🪪",
      title: "Identity Verification",
      desc: "Aadhaar / e-KYC issues",
    },
    {
      icon: "📊",
      title: "Market Price Issue",
      desc: "Incorrect or missing prices",
    },
    {
      icon: "🤝",
      title: "Buyer/Seller Issue",
      desc: "Problems with a trade",
    },
    {
      icon: "📦",
      title: "Order Issue",
      desc: "Order tracking, disputes",
    },
    {
      icon: "₹",
      title: "Payment Issue",
      desc: "Payment problems",
    },
    {
      icon: "🎙",
      title: "Voice Access",
      desc: "IVR / phone access help",
    },
    {
      icon: "📶",
      title: "Offline Support",
      desc: "Sync and offline issues",
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="font-serif text-3xl text-[var(--foreground)]">
        Help & Support
      </h1>

      <div className="grid sm:grid-cols-2 gap-3">
        {[
          {
            icon: "📞",
            label: "Contact AgriLink",
            color:
              "bg-blue-50 border-blue-200 text-blue-700",
          },
          {
            icon: "📝",
            label: "Raise Complaint",
            color:
              "bg-orange-50 border-orange-200 text-orange-700",
          },
          {
            icon: "🔍",
            label: "Track Complaint",
            color:
              "bg-[var(--muted)] border-[var(--border)] text-[var(--muted-foreground)]",
          },
          {
            icon: "🚨",
            label: "Report Fraud",
            color:
              "bg-red-50 border-red-200 text-red-700",
          },
        ].map(action => (
          <button
            key={action.label}
            className={`${action.color} border rounded-2xl p-4 text-left hover:shadow-md transition-shadow`}
          >
            <div className="text-2xl mb-2">
              {action.icon}
            </div>

            <div className="font-semibold text-sm">
              {action.label}
            </div>
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-base font-semibold text-[var(--foreground)] mb-3">
          Browse Help Topics
        </h2>

        <div className="grid sm:grid-cols-3 gap-3">
          {CATEGORIES.map(cat => (
            <Card
              key={cat.title}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">
                {cat.icon}
              </div>

              <div className="font-semibold text-sm text-[var(--foreground)]">
                {cat.title}
              </div>

              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                {cat.desc}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-5 bg-[var(--green-pale)] border-green-200">
        <h3 className="font-semibold text-[var(--foreground)] mb-2">
          AgriLink Trust & Safety
        </h3>

        <div className="space-y-2">
          {[
            "✓ Verified buyer process",
            "✓ Transparent market prices with source and date",
            "✓ Secure multi-factor authentication",
            "✓ Consent-based identity verification",
            "✓ Privacy controls and data transparency",
            "✓ Fraud reporting and complaint system",
          ].map(item => (
            <div
              key={item}
              className="text-sm text-[var(--foreground)]"
            >
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Profile (Farmer) ──────────────────────────────────────────────────────────
export function FarmerProfile() {
  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-2xl mx-auto">
      <h1 className="font-serif text-3xl text-[var(--foreground)]">
        Farmer Profile
      </h1>

      {/* Avatar + Basic */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[var(--green-mid)] flex items-center justify-center text-white text-2xl font-bold font-serif">
            RK
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              {DEMO_FARMER.name}
            </h2>

            <p className="text-[var(--muted-foreground)] text-sm">
              {DEMO_FARMER.village}, {DEMO_FARMER.district},{" "}
              {DEMO_FARMER.state}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <Badge variant="success" size="xs">
                Identity Verified
              </Badge>

              <Badge variant="success" size="xs">
                Face Verification On
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              label: "Mobile",
              value: DEMO_FARMER.phone,
            },
            {
              label: "Email",
              value: DEMO_FARMER.email || "Not set",
            },
            {
              label: "Preferred Language",
              value: DEMO_FARMER.language,
            },
            {
              label: "State",
              value: DEMO_FARMER.state,
            },
          ].map(item => (
            <div
              key={item.label}
              className="bg-[var(--muted)] rounded-xl p-3"
            >
              <div className="text-xs text-[var(--muted-foreground)]">
                {item.label}
              </div>

              <div className="text-sm font-medium text-[var(--foreground)] mt-0.5">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-5">
        <h3 className="font-semibold text-[var(--foreground)] mb-4">
          Security Settings
        </h3>

        <div className="space-y-3">
          {[
            {
              label: "Face Verification",
              desc: "Enabled — used for login authentication",
              status: "enabled",
            },
            {
              label: "Identity Verification",
              desc: "Aadhaar-based verification completed",
              status: "done",
            },
            {
              label: "Two-Factor Authentication",
              desc: "Via mobile OTP",
              status: "enabled",
            },
          ].map(item => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
            >
              <div>
                <div className="text-sm font-medium text-[var(--foreground)]">
                  {item.label}
                </div>

                <div className="text-xs text-[var(--muted-foreground)]">
                  {item.desc}
                </div>
              </div>

              <Badge variant="success" size="xs">
                Active
              </Badge>
            </div>
          ))}
        </div>

        <p className="text-xs text-[var(--muted-foreground)] mt-3">
          Face biometric template data is stored encrypted. Your face image
          is not stored.
        </p>
      </Card>

      <Button variant="secondary" fullWidth>
        Edit Profile
      </Button>
    </div>
  );
}

// ── Buyer Profile ─────────────────────────────────────────────────────────────
export function BuyerProfile() {
  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-2xl mx-auto">
      <h1 className="font-serif text-3xl text-[var(--foreground)]">
        Business Profile
      </h1>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] text-xl font-bold border border-[var(--border)]">
            SV
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Sri Venkateshwara Agro Exports
            </h2>

            <p className="text-[var(--muted-foreground)] text-sm">
              Exporter · Bengaluru, Karnataka
            </p>

            <StatusBadge status="Verification Pending" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {[
            {
              label: "Business ID",
              value: "SVAE/KA/2024/001",
            },
            {
              label: "Business Type",
              value: "Exporter",
            },
            {
              label: "Contact",
              value: "+91 80XXX XXXXX",
            },
            {
              label: "Email",
              value:
                "procurement@svagroexports.example.com",
            },
          ].map(item => (
            <div
              key={item.label}
              className="bg-[var(--muted)] rounded-xl p-3"
            >
              <div className="text-xs text-[var(--muted-foreground)]">
                {item.label}
              </div>

              <div className="text-sm font-medium text-[var(--foreground)] mt-0.5 truncate">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>Verification Pending</strong> — Business verification is
          in progress. Some features may be limited until verification is
          complete. GST verification is not yet connected.
        </div>
      </Card>

      <Button variant="secondary" fullWidth>
        Edit Business Profile
      </Button>
    </div>
  );
}