import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { apiClient } from "../../api/client";

type BillingCycle = "WEEKLY" | "MONTHLY" | "YEARLY";

type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

type CategoryRequest = {
  name: string;
  color: string;
  icon: string;
};

type SubscriptionRequest = {
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  categoryId: string;
  reminderDaysBefore: number;
};

type SubscriptionModel = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  categoryId: string;
  reminderDaysBefore: number;
  active: boolean;
  nextBillingDate: number;
};

type SubscriptionApiResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  categoryId: string;
  reminderDaysBefore: number;
  active: boolean;
  nextBillingDate: number;
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(timestamp);
}

function toCategoryModel(category: Category): Category {
  return {
    id: category.id,
    name: category.name,
    color: category.color || "#8f8f8f",
    icon: category.icon || "Tag",
  };
}

function toSubscriptionModel(
  subscription: SubscriptionApiResponse,
): SubscriptionModel {
  return {
    id: subscription.id,
    name: subscription.name,
    description: subscription.description || "No description",
    price: subscription.price,
    currency: subscription.currency,
    billingCycle: subscription.billingCycle,
    categoryId: subscription.categoryId,
    reminderDaysBefore: subscription.reminderDaysBefore ?? 0,
    active: subscription.active ?? true,
    nextBillingDate: subscription.nextBillingDate ?? Date.now(),
  };
}

function Subscription() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionModel[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryRequest>({
    name: "",
    color: "#8f8f8f",
    icon: "Tag",
  });
  const [isAddSubscriptionModalOpen, setIsAddSubscriptionModalOpen] =
    useState(false);
  const [isAddingSubscription, setIsAddingSubscription] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
    useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [deleteCategoryError, setDeleteCategoryError] = useState<string | null>(
    null,
  );
  const [activeCategoryForDelete, setActiveCategoryForDelete] =
    useState<Category | null>(null);
  const [activeCategoryForSubscription, setActiveCategoryForSubscription] =
    useState<Category | null>(null);
  const [addSubscriptionError, setAddSubscriptionError] = useState<
    string | null
  >(null);
  const [isSubscriptionDetailsModalOpen, setIsSubscriptionDetailsModalOpen] =
    useState(false);
  const [activeSubscription, setActiveSubscription] =
    useState<SubscriptionModel | null>(null);
  const [isDeleteSubscriptionModalOpen, setIsDeleteSubscriptionModalOpen] =
    useState(false);
  const [isDeletingSubscription, setIsDeletingSubscription] = useState(false);
  const [deleteSubscriptionError, setDeleteSubscriptionError] = useState<
    string | null
  >(null);
  const [subscriptionForm, setSubscriptionForm] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    billingCycle: "MONTHLY" as BillingCycle,
    reminderDaysBefore: "3",
  });

  useEffect(() => {
    const loadPageData = async () => {
      setIsPageLoading(true);
      setPageError(null);

      try {
        const [categoriesData, subscriptionsData] = await Promise.all([
          apiClient<Category[]>("/api/categories", { method: "GET" }),
          apiClient<SubscriptionApiResponse[]>("/api/subscriptions", {
            method: "GET",
          }),
        ]);

        const normalizedCategories = categoriesData.map(toCategoryModel);
        const normalizedSubscriptions =
          subscriptionsData.map(toSubscriptionModel);

        const knownCategoryIds = new Set(
          normalizedCategories.map((item) => item.id),
        );
        const missingCategoryIds = Array.from(
          new Set(
            normalizedSubscriptions
              .map((item) => item.categoryId)
              .filter((item) => item && !knownCategoryIds.has(item)),
          ),
        );

        const generatedCategories: Category[] = missingCategoryIds.map(
          (id) => ({
            id,
            name: id,
            color: "#8f8f8f",
            icon: "Tag",
          }),
        );

        setCategories([...normalizedCategories, ...generatedCategories]);
        setSubscriptions(normalizedSubscriptions);
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : "Could not load subscriptions.";
        setPageError(message);
      }

      setIsPageLoading(false);
    };

    void loadPageData();
  }, []);

  const resetCreateForm = () => {
    setCategoryForm({ name: "", color: "#8f8f8f", icon: "Tag" });
    setFormError(null);
  };

  const openCreateModal = () => {
    resetCreateForm();
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsCreateModalOpen(false);
    setFormError(null);
  };

  const handleCreateCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryForm.name.trim()) {
      setFormError("Category name is required.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload: CategoryRequest = {
        name: categoryForm.name.trim(),
        color: categoryForm.color.trim() || "#8f8f8f",
        icon: categoryForm.icon.trim() || "Tag",
      };

      const createdCategory = await apiClient<Category>("/api/categories", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setCategories((prev) => [toCategoryModel(createdCategory), ...prev]);
      setIsCreateModalOpen(false);
      resetCreateForm();
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Could not create category. Please try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAddSubscriptionModal = (category: Category) => {
    setActiveCategoryForSubscription(category);
    setAddSubscriptionError(null);
    setSubscriptionForm({
      name: "",
      description: "",
      price: "",
      currency: "USD",
      billingCycle: "MONTHLY",
      reminderDaysBefore: "3",
    });
    setIsAddSubscriptionModalOpen(true);
  };

  const closeAddSubscriptionModal = () => {
    if (isAddingSubscription) {
      return;
    }

    setIsAddSubscriptionModalOpen(false);
    setAddSubscriptionError(null);
    setActiveCategoryForSubscription(null);
  };

  const handleAddSubscription = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeCategoryForSubscription) {
      setAddSubscriptionError("Category context is missing.");
      return;
    }

    if (!subscriptionForm.name.trim()) {
      setAddSubscriptionError("Subscription name is required.");
      return;
    }

    const parsedPrice = Number(subscriptionForm.price);
    const parsedReminderDays = Number(subscriptionForm.reminderDaysBefore);

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setAddSubscriptionError("Price must be a valid number greater than 0.");
      return;
    }

    if (!Number.isFinite(parsedReminderDays) || parsedReminderDays < 0) {
      setAddSubscriptionError("Reminder days must be 0 or a positive number.");
      return;
    }

    setIsAddingSubscription(true);
    setAddSubscriptionError(null);

    try {
      const payload: SubscriptionRequest = {
        name: subscriptionForm.name.trim(),
        description: subscriptionForm.description.trim(),
        price: parsedPrice,
        currency: subscriptionForm.currency.trim() || "USD",
        billingCycle: subscriptionForm.billingCycle,
        categoryId: activeCategoryForSubscription.id,
        reminderDaysBefore: parsedReminderDays,
      };

      const createdSubscription = await apiClient<SubscriptionApiResponse>(
        "/api/subscriptions",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
      );
      setSubscriptions((prev) => [
        toSubscriptionModel(createdSubscription),
        ...prev,
      ]);
      closeAddSubscriptionModal();
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Could not add subscription. Please try again.";
      setAddSubscriptionError(message);
    } finally {
      setIsAddingSubscription(false);
    }
  };

  const openDeleteCategoryModal = (category: Category) => {
    setActiveCategoryForDelete(category);
    setDeleteCategoryError(null);
    setIsDeleteCategoryModalOpen(true);
  };

  const closeDeleteCategoryModal = () => {
    if (isDeletingCategory) {
      return;
    }

    setIsDeleteCategoryModalOpen(false);
    setDeleteCategoryError(null);
    setActiveCategoryForDelete(null);
  };

  const handleDeleteCategory = async () => {
    if (!activeCategoryForDelete) {
      return;
    }

    setIsDeletingCategory(true);
    setDeleteCategoryError(null);

    try {
      await apiClient<string>(
        `/api/categories/${encodeURIComponent(activeCategoryForDelete.id)}`,
        {
          method: "DELETE",
        },
      );

      setCategories((prev) =>
        prev.filter((category) => category.id !== activeCategoryForDelete.id),
      );
      setSubscriptions((prev) =>
        prev.filter((sub) => sub.categoryId !== activeCategoryForDelete.id),
      );
      closeDeleteCategoryModal();
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Could not delete category. Please try again.";
      setDeleteCategoryError(message);
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const openSubscriptionDetailsModal = (subscription: SubscriptionModel) => {
    setActiveSubscription(subscription);
    setDeleteSubscriptionError(null);
    setIsDeleteSubscriptionModalOpen(false);
    setIsSubscriptionDetailsModalOpen(true);
  };

  const closeSubscriptionDetailsModal = () => {
    if (isDeletingSubscription) {
      return;
    }

    setIsSubscriptionDetailsModalOpen(false);
    setActiveSubscription(null);
    setDeleteSubscriptionError(null);
    setIsDeleteSubscriptionModalOpen(false);
  };

  const openDeleteSubscriptionModal = () => {
    setDeleteSubscriptionError(null);
    setIsDeleteSubscriptionModalOpen(true);
  };

  const closeDeleteSubscriptionModal = () => {
    if (isDeletingSubscription) {
      return;
    }

    setDeleteSubscriptionError(null);
    setIsDeleteSubscriptionModalOpen(false);
  };

  const handleDeleteSubscription = async () => {
    if (!activeSubscription) {
      return;
    }

    setIsDeletingSubscription(true);
    setDeleteSubscriptionError(null);

    try {
      await apiClient<void>(
        `/api/subscriptions/${encodeURIComponent(activeSubscription.id)}`,
        {
          method: "DELETE",
        },
      );

      setSubscriptions((prev) =>
        prev.filter(
          (subscription) => subscription.id !== activeSubscription.id,
        ),
      );
      closeSubscriptionDetailsModal();
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Could not delete subscription. Please try again.";
      setDeleteSubscriptionError(message);
    } finally {
      setIsDeletingSubscription(false);
    }
  };

  return (
    <section className="subscription-page">
      <header className="top-strip">
        <div>
          <p className="kicker">Live View</p>
          <h2 className="main-heading">Subscriptions by Category</h2>
        </div>

        <button
          type="button"
          className="create-category-button"
          onClick={openCreateModal}
        >
          Create Category
        </button>
      </header>

      {isPageLoading ? (
        <p className="page-status-copy">Loading data...</p>
      ) : null}
      {pageError ? <p className="form-error-text">{pageError}</p> : null}

      <div className="category-stack">
        {!isPageLoading && categories.length === 0 ? (
          <p className="empty-category-copy">No categories created yet.</p>
        ) : null}

        {categories.map((category) => {
          const relatedSubscriptions = subscriptions.filter(
            (sub) => sub.categoryId === category.id,
          );

          return (
            <article key={category.id} className="category-band panel">
              <header className="category-band-header">
                <div className="category-meta">
                  <span
                    className="category-dot"
                    style={{ backgroundColor: category.color }}
                    aria-hidden="true"
                  />
                  <div>
                    <h3>{category.name}</h3>
                    <small>
                      {category.icon} • {relatedSubscriptions.length}{" "}
                      subscriptions
                    </small>
                  </div>
                </div>

                <div className="category-action-buttons">
                  <button
                    type="button"
                    className="add-subscription-button"
                    onClick={() => openAddSubscriptionModal(category)}
                  >
                    Add Subscription
                  </button>

                  <button
                    type="button"
                    className="delete-category-button"
                    onClick={() => openDeleteCategoryModal(category)}
                    aria-label={`Delete ${category.name}`}
                    title="Delete category"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm-2 6h2v9H7V9zm4 0h2v9h-2V9zm4 0h2v9h-2V9z" />
                    </svg>
                  </button>
                </div>
              </header>

              <div className="subscription-card-row">
                {relatedSubscriptions.length > 0 ? (
                  relatedSubscriptions.map((sub) => (
                    <section
                      key={sub.id}
                      className="subscription-card"
                      role="button"
                      tabIndex={0}
                      onClick={() => openSubscriptionDetailsModal(sub)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          openSubscriptionDetailsModal(sub);
                        }
                      }}
                      aria-label={`Open details for ${sub.name}`}
                    >
                      <div className="subscription-card-head">
                        <h4>{sub.name}</h4>
                        <span
                          className={sub.active ? "chip active" : "chip paused"}
                        >
                          {sub.active ? "Active" : "Paused"}
                        </span>
                      </div>

                      <p className="subscription-price">
                        {formatMoney(sub.price, sub.currency)}
                      </p>

                      <div className="subscription-meta-row">
                        <div className="subscription-meta-item">
                          <span>Cycle</span>
                          <strong>{sub.billingCycle}</strong>
                        </div>
                        <div className="subscription-meta-item">
                          <span>Next Billing</span>
                          <strong>{formatDate(sub.nextBillingDate)}</strong>
                        </div>
                      </div>
                    </section>
                  ))
                ) : (
                  <p className="empty-category-copy">
                    No subscriptions in this category yet.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {isCreateModalOpen ? (
        <div
          className="create-category-modal-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeCreateModal();
            }
          }}
        >
          <section
            className="create-category-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Create category"
          >
            <h3>Create Category</h3>

            <form
              className="create-category-form"
              onSubmit={handleCreateCategory}
            >
              <label>
                Category Name
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(event) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. Productivity"
                  required
                />
              </label>

              <label>
                Color
                <input
                  type="text"
                  value={categoryForm.color}
                  onChange={(event) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      color: event.target.value,
                    }))
                  }
                  placeholder="#8f8f8f"
                />
              </label>

              <label>
                Icon
                <input
                  type="text"
                  value={categoryForm.icon}
                  onChange={(event) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      icon: event.target.value,
                    }))
                  }
                  placeholder="Tag"
                />
              </label>

              {formError ? (
                <p className="form-error-text">{formError}</p>
              ) : null}

              <div className="create-category-actions">
                <button
                  type="button"
                  className="create-category-cancel"
                  onClick={closeCreateModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="create-category-submit">
                  {isSubmitting ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {isAddSubscriptionModalOpen && activeCategoryForSubscription ? (
        <div
          className="create-category-modal-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeAddSubscriptionModal();
            }
          }}
        >
          <section
            className="create-category-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Add subscription"
          >
            <h3>Add Subscription</h3>

            <form
              className="create-category-form"
              onSubmit={handleAddSubscription}
            >
              <label>
                Category
                <input
                  type="text"
                  value={activeCategoryForSubscription.name}
                  disabled
                />
              </label>

              <label>
                Subscription Name
                <input
                  type="text"
                  value={subscriptionForm.name}
                  onChange={(event) =>
                    setSubscriptionForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. Netflix"
                  required
                />
              </label>

              <label>
                Description
                <input
                  type="text"
                  value={subscriptionForm.description}
                  onChange={(event) =>
                    setSubscriptionForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Short description"
                  required
                />
              </label>

              <label>
                Price
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={subscriptionForm.price}
                  onChange={(event) =>
                    setSubscriptionForm((prev) => ({
                      ...prev,
                      price: event.target.value,
                    }))
                  }
                  placeholder="0.00"
                  required
                />
              </label>

              <label>
                Currency
                <input
                  type="text"
                  value={subscriptionForm.currency}
                  onChange={(event) =>
                    setSubscriptionForm((prev) => ({
                      ...prev,
                      currency: event.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="USD"
                  required
                />
              </label>

              <label>
                Billing Cycle
                <select
                  value={subscriptionForm.billingCycle}
                  onChange={(event) =>
                    setSubscriptionForm((prev) => ({
                      ...prev,
                      billingCycle: event.target.value as BillingCycle,
                    }))
                  }
                >
                  <option value="WEEKLY">WEEKLY</option>
                  <option value="MONTHLY">MONTHLY</option>
                  <option value="YEARLY">YEARLY</option>
                </select>
              </label>

              <label>
                Reminder Days Before
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={subscriptionForm.reminderDaysBefore}
                  onChange={(event) =>
                    setSubscriptionForm((prev) => ({
                      ...prev,
                      reminderDaysBefore: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              {addSubscriptionError ? (
                <p className="form-error-text">{addSubscriptionError}</p>
              ) : null}

              <div className="create-category-actions">
                <button
                  type="button"
                  className="create-category-cancel"
                  onClick={closeAddSubscriptionModal}
                  disabled={isAddingSubscription}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="create-category-submit"
                  disabled={isAddingSubscription}
                >
                  {isAddingSubscription ? "Adding..." : "Add Subscription"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {isDeleteCategoryModalOpen && activeCategoryForDelete ? (
        <div
          className="create-category-modal-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteCategoryModal();
            }
          }}
        >
          <section
            className="create-category-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Delete category"
          >
            <h3>Delete Category</h3>
            <p className="delete-category-text">
              Are you sure you want to delete "{activeCategoryForDelete.name}"?
              This will also remove its subscriptions from the page.
            </p>

            {deleteCategoryError ? (
              <p className="form-error-text">{deleteCategoryError}</p>
            ) : null}

            <div className="create-category-actions">
              <button
                type="button"
                className="create-category-cancel"
                onClick={closeDeleteCategoryModal}
                disabled={isDeletingCategory}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-category-confirm"
                onClick={handleDeleteCategory}
                disabled={isDeletingCategory}
              >
                {isDeletingCategory ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {isSubscriptionDetailsModalOpen && activeSubscription ? (
        <div
          className="create-category-modal-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeSubscriptionDetailsModal();
            }
          }}
        >
          <section
            className="subscription-details-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Subscription details"
          >
            <div className="subscription-details-head">
              <div>
                <p className="subscription-details-kicker">Subscription</p>
                <h3>{activeSubscription.name}</h3>
              </div>
              <span
                className={
                  activeSubscription.active ? "chip active" : "chip paused"
                }
              >
                {activeSubscription.active ? "Active" : "Paused"}
              </span>
            </div>

            <p className="subscription-details-price">
              {formatMoney(
                activeSubscription.price,
                activeSubscription.currency,
              )}
            </p>

            <div className="subscription-details-grid">
              <div className="subscription-details-item">
                <span>Description</span>
                <strong>{activeSubscription.description || "-"}</strong>
              </div>
              <div className="subscription-details-item">
                <span>Billing Cycle</span>
                <strong>{activeSubscription.billingCycle}</strong>
              </div>
              <div className="subscription-details-item">
                <span>Reminder</span>
                <strong>
                  {activeSubscription.reminderDaysBefore} day
                  {activeSubscription.reminderDaysBefore === 1 ? "" : "s"}{" "}
                  before
                </strong>
              </div>
              <div className="subscription-details-item">
                <span>Next Billing</span>
                <strong>
                  {formatDate(activeSubscription.nextBillingDate)}
                </strong>
              </div>
              <div className="subscription-details-item">
                <span>Category</span>
                <strong>
                  {categories.find(
                    (category) => category.id === activeSubscription.categoryId,
                  )?.name || activeSubscription.categoryId}
                </strong>
              </div>
              <div className="subscription-details-item">
                <span>Currency</span>
                <strong>{activeSubscription.currency}</strong>
              </div>
            </div>

            <div className="subscription-details-actions">
              <button
                type="button"
                className="create-category-cancel"
                onClick={closeSubscriptionDetailsModal}
                disabled={isDeletingSubscription}
              >
                Close
              </button>
              <button
                type="button"
                className="delete-category-confirm"
                onClick={openDeleteSubscriptionModal}
                disabled={isDeletingSubscription}
              >
                Delete Subscription
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {isDeleteSubscriptionModalOpen && activeSubscription ? (
        <div
          className="create-category-modal-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteSubscriptionModal();
            }
          }}
        >
          <section
            className="create-category-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Delete subscription"
          >
            <h3>Delete Subscription</h3>
            <p className="delete-category-text">
              Are you sure you want to delete "{activeSubscription.name}"? This
              action cannot be undone.
            </p>

            {deleteSubscriptionError ? (
              <p className="form-error-text">{deleteSubscriptionError}</p>
            ) : null}

            <div className="create-category-actions">
              <button
                type="button"
                className="create-category-cancel"
                onClick={closeDeleteSubscriptionModal}
                disabled={isDeletingSubscription}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-category-confirm"
                onClick={handleDeleteSubscription}
                disabled={isDeletingSubscription}
              >
                {isDeletingSubscription ? "Deleting..." : "Delete Subscription"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}

export default Subscription;
