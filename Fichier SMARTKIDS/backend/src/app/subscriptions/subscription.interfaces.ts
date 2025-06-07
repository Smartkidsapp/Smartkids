import { UserDocument } from '../users/schemas/users.schema';
import { SubscriptionPlanDocument } from './schemas/subscription-plan.schema';
import { SubscriptionDocument } from './schemas/subscription.schema';

/**
 * Applying the Bridge pattern to the subscription service.
 */

/**
 * The implementation interface for the provider subscription service.
 */
export interface IProviderSubscription<ProviderSubscriptionObject> {
  /**
   * Sets up a user subscription.
   * @param data - An object containing subscription plan, payment method, subscription, and user details.
   * @returns A promise that resolves to an object containing the subscription and provider subscription details.
   */
  setupUserSubscription(data: {
    subscriptionPlan: SubscriptionPlanDocument;
    paymentMethod: string;
    subscription: SubscriptionDocument;
    user: UserDocument;
  }): Promise<{
    subscription: SubscriptionDocument;
    providerSubscription: ProviderSubscriptionObject;
  }>;

  /**
   * Changes the subscription plan for a user.
   * @param data - An object containing user, subscription, subscription plan, and payment method details.
   * @returns A promise that resolves to an object containing the updated subscription and provider subscription details.
   */
  changeSubscriptionPlan(data: {
    user: UserDocument;
    subscription: SubscriptionDocument;
    subscriptionPlan: SubscriptionPlanDocument;
    paymentMethod: string;
  }): Promise<{
    subscription: SubscriptionDocument;
    providerSubscription: ProviderSubscriptionObject;
  }>;

  /**
   * Cancels a user's subscription.
   * @param userDocument - The user document.
   * @param subscription - The subscription document.
   * @returns A promise that resolves to the provider subscription object or null if cancellation fails.
   */
  cancel(
    userDocument: UserDocument,
    subscription: SubscriptionDocument,
  ): Promise<ProviderSubscriptionObject | null>;

  /**
   * Checks if a user can set up a subscription.
   * @param user - The user document.
   * @param subscription - The subscription document.
   * @returns A promise that resolves to an object containing the status and message.
   */
  canUserSetupSubscription(
    user: UserDocument,
    subscription: SubscriptionDocument,
  ): Promise<{
    status: boolean;
    message: string;
  }>;

  /**
   * Retrieves the subscription details for a user.
   * @param id - The ID of the user.
   * @returns A promise that resolves to the provider subscription object or null if not found.
   */
  getSubscription(id: string): Promise<ProviderSubscriptionObject | null>;
}

/**
 * The abstract class for the provider subscription service.
 * For simplicity and because of our use case the class just implements the interface.
 */
export abstract class ProviderSubscriptionService<ProviderSubscriptionObject>
  implements IProviderSubscription<ProviderSubscriptionObject>
{
  constructor(
    private readonly implementation: IProviderSubscription<ProviderSubscriptionObject>,
  ) {}

  /**
   * Sets up a user subscription.
   * @param data - An object containing subscription plan, payment method, subscription, and user details.
   * @returns A promise that resolves to an object containing the subscription and provider subscription details.
   */
  setupUserSubscription(data: {
    subscriptionPlan: SubscriptionPlanDocument;
    paymentMethod: string;
    subscription: SubscriptionDocument;
    user: UserDocument;
  }): Promise<{
    subscription: SubscriptionDocument;
    providerSubscription: ProviderSubscriptionObject;
  }> {
    return this.implementation.setupUserSubscription(data);
  }

  /**
   * Changes the subscription plan for a user.
   * @param data - An object containing user, subscription, subscription plan, and payment method details.
   * @returns A promise that resolves to an object containing the updated subscription and provider subscription details.
   */
  changeSubscriptionPlan(data: {
    user: UserDocument;
    subscription: SubscriptionDocument;
    subscriptionPlan: SubscriptionPlanDocument;
    paymentMethod: string;
  }): Promise<{
    subscription: SubscriptionDocument;
    providerSubscription: ProviderSubscriptionObject;
  }> {
    return this.implementation.changeSubscriptionPlan(data);
  }

  /**
   * Cancels a user's subscription.
   * @param userDocument - The user document.
   * @param subscription - The subscription document.
   * @returns A promise that resolves to the provider subscription object or null if cancellation fails.
   */
  cancel(
    userDocument: UserDocument,
    subscription: SubscriptionDocument,
  ): Promise<ProviderSubscriptionObject | null> {
    return this.implementation.cancel(userDocument, subscription);
  }

  /**
   * Checks if a user can set up a subscription.
   * @param user - The user document.
   * @param subscription - The subscription document.
   * @returns A promise that resolves to an object containing the status and message.
   */
  canUserSetupSubscription(
    user: UserDocument,
    subscription: SubscriptionDocument,
  ): Promise<{
    status: boolean;
    message: string;
  }> {
    return this.implementation.canUserSetupSubscription(user, subscription);
  }

  /**
   * Retrieves the subscription details for a user.
   * @param id - The ID of the user.
   * @returns A promise that resolves to the provider subscription object or null if not found.
   */
  getSubscription(id: string): Promise<ProviderSubscriptionObject | null> {
    return this.implementation.getSubscription(id);
  }
}
