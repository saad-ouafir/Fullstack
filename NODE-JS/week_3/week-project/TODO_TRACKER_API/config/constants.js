// Application constants
const PRIORITIES = ["low", "medium", "high"];
const STATUSES = ["all", "active", "completed"];
const DEFAULT_PRIORITY = "medium";
const DEFAULT_COMPLETED = false;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// Validation patterns
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Allowed fields for updates
const ALLOWED_UPDATE_FIELDS = ["title", "completed", "priority", "dueDate"];

module.exports = {
  PRIORITIES,
  STATUSES,
  DEFAULT_PRIORITY,
  DEFAULT_COMPLETED,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  DATE_REGEX,
  ALLOWED_UPDATE_FIELDS,
};
