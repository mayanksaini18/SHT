"use client";

import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import type { UserGoals, ReminderTimes } from "@/types/user";

export function useUpdateGoals() {
  const updateGoals = useAuthStore((s) => s.updateGoals);
  return useMutation({
    mutationFn: (goals: Partial<UserGoals>) =>
      fetchApi<{ goals: UserGoals }>("/settings/goals", {
        method: "PUT",
        body: JSON.stringify(goals),
      }),
    onSuccess: (data) => updateGoals(data.goals),
  });
}

export function useUpdateReminders() {
  const updateReminderTimes = useAuthStore((s) => s.updateReminderTimes);
  return useMutation({
    mutationFn: (times: Partial<ReminderTimes>) =>
      fetchApi<{ reminderTimes: ReminderTimes }>("/settings/reminders", {
        method: "PUT",
        body: JSON.stringify(times),
      }),
    onSuccess: (data) => updateReminderTimes(data.reminderTimes),
  });
}

export async function getVapidPublicKey(): Promise<string> {
  const data = await fetchApi<{ publicKey: string }>("/settings/vapid-public-key");
  return data.publicKey;
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const reg = await navigator.serviceWorker.ready;
  const publicKey = await getVapidPublicKey();
  if (!publicKey) return null;

  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  await fetchApi("/settings/push-subscribe", {
    method: "POST",
    body: JSON.stringify(subscription.toJSON()),
  });

  return subscription;
}

export async function unsubscribeFromPush(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.ready;
  const subscription = await reg.pushManager.getSubscription();
  if (!subscription) return;

  await fetchApi("/settings/push-unsubscribe", {
    method: "DELETE",
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  });
  await subscription.unsubscribe();
}

export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator)) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager.getSubscription();
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr.buffer;
}
