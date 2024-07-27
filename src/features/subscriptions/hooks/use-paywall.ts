import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription";
import { useRouter } from "next/navigation";

export const usePaywall = () => {
  const router = useRouter();
  const { 
    data: subscription,
    isLoading: isLoadingSubscription,
  } = useGetSubscription();

  const shouldBlock = isLoadingSubscription || !subscription?.active;

  return {
    isLoading: isLoadingSubscription,
    shouldBlock,
    triggerPaywall: () => {
      router.push("/billing");
    },
  };
};