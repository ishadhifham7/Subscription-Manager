forntend

📁 src/
📁 app/ entry point
App.jsx
main.jsx
index.css
📁 modules/ mirrors Spring modules/
📁 user/
UserPage.jsx
LoginPage.jsx
SignupPage.jsx
user.api.js axios calls
user.types.js constants / enums
useUser.js custom hook
📁 subscription/
SubscriptionList.jsx
SubscriptionCard.jsx
SubscriptionForm.jsx
SubscriptionDetail.jsx
subscription.api.js axios calls
subscription.types.js constants / enums
useSubscription.js custom hook
📁 category/
CategoryList.jsx
CategoryBadge.jsx
category.api.js axios calls
useCategory.js custom hook
📁 reminder/ new module
ReminderList.jsx
ReminderForm.jsx
reminder.api.js axios calls
reminder.types.js constants / enums
useReminder.js custom hook
📁 common/ shared UI
📁 components/
Button.jsx
Modal.jsx
Table.jsx
Spinner.jsx
Toast.jsx
📁 layout/
Sidebar.jsx
Navbar.jsx
DashboardLayout.jsx
📁 config/ mirrors Spring config/
axiosInstance.js base URL + JWT interceptor
routes.jsx React Router config
constants.js
📁 store/ global state
authStore.js Zustand / Context
subscriptionStore.js
📁 hooks/ global hooks
useAuth.js
useToast.js
📁 utils/
dateUtils.js
currencyUtils.js
validators.js
📁 assets/
logo.svg
📁 icons/

backend
src/main/java/com/ishadh/subscriptionmanager

├── config/
├── common/
├── exception/

├── modules/
│ ├── user/
│ │ ├── user.controller.java
│ │ ├── user.service.java
│ │ ├── user.repository.java
│ │ ├── user.schema.java
│ │ ├── user.types.java
│ │ └── user.mapper.java
│
│ ├── subscription/
│ │ ├── subscription.controller.java
│ │ ├── subscription.service.java
│ │ ├── subscription.repository.java
│ │ ├── subscription.schema.java
│ │ ├── subscription.types.java
│ │ └── subscription.mapper.java
│
│ ├── category/
│ │ ├── category.controller.java
│ │ ├── category.service.java
│ │ ├── category.repository.java
│ │ ├── category.schema.java
│ │ ├── category.types.java
│ │ └── category.mapper.java
