/**
 * validatorService.js
 * Comprehensive input validation & sanitization service.
 * Enforces strict typing, range boundaries, string lengths, and safe characters
 * to prevent injection, overflow, or malformed data attacks.
 */

const ALLOWED_EVENT_TYPES = ['WEDDING', 'BIRTHDAY', 'COMMUNITY', 'OTHER'];
const ALLOWED_BUDGET_CATEGORIES = ['VENUE', 'CATERING', 'DECOR', 'ENTERTAINMENT', 'MEDIA', 'LOGISTICS', 'CONTINGENCY', 'OTHER'];
const ALLOWED_TIMELINE_PHASES = ['EARLY_PLANNING', 'MID_PLANNING', 'FINAL_PREP', 'DAY_OF', 'POST_EVENT'];
const ALLOWED_VENDOR_CATEGORIES = ['VENUE', 'CATERING', 'PHOTOGRAPHY', 'MUSIC', 'FLORIST', 'RENTALS', 'OFFICIANT', 'SECURITY', 'OTHER'];
const ALLOWED_VENDOR_STATUSES = ['NOT_CONTACTED', 'INQUIRED', 'SHORTLISTED', 'BOOKED', 'CONFIRMED'];
const ALLOWED_IDEA_CATEGORIES = ['THEME_DECOR', 'FOOD_BEVERAGE', 'ENTERTAINMENT', 'GIFT_FAVOR', 'LOGISTICS'];
const ALLOWED_COST_TIERS = ['LOW', 'MEDIUM', 'HIGH'];

function sanitizeString(val, maxLen = 255) {
  if (typeof val !== 'string') return '';
  return val.replace(/<[^>]*>?/gm, '').trim().slice(0, maxLen);
}

function validateUUID(str) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof str === 'string' && uuidRegex.test(str);
}

function validateEventInput(data, isUpdate = false) {
  const errors = [];
  const clean = {};

  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Event name is required');
    } else if (data.name.trim().length > 120) {
      errors.push('Event name must not exceed 120 characters');
    } else {
      clean.name = sanitizeString(data.name, 120);
    }
  }

  if (!isUpdate || data.eventType !== undefined) {
    const typeUpper = (data.eventType || '').toUpperCase();
    if (!ALLOWED_EVENT_TYPES.includes(typeUpper)) {
      errors.push(`eventType must be one of: ${ALLOWED_EVENT_TYPES.join(', ')}`);
    } else {
      clean.eventType = typeUpper;
    }
  }

  if (data.targetDate !== undefined && data.targetDate !== null) {
    if (typeof data.targetDate !== 'string' || data.targetDate.length > 50) {
      errors.push('targetDate must be a string up to 50 characters (YYYY-MM-DD)');
    } else {
      clean.targetDate = sanitizeString(data.targetDate, 50);
    }
  }

  if (!isUpdate || data.guestCount !== undefined) {
    const rawGuests = data.guestCount !== undefined ? data.guestCount : 50;
    const guests = Number(rawGuests);
    if (isNaN(guests) || guests < 1 || guests > 100000) {
      errors.push('guestCount must be a positive integer between 1 and 100,000');
    } else {
      clean.guestCount = Math.floor(guests);
    }
  }

  if (!isUpdate || data.totalBudget !== undefined) {
    const budget = Number(data.totalBudget);
    if (isNaN(budget) || budget < 0 || budget > 100000000) {
      errors.push('totalBudget must be a non-negative number up to 100,000,000');
    } else {
      clean.totalBudget = Math.round(budget * 100) / 100;
    }
  }

  if (data.currency !== undefined) {
    clean.currency = sanitizeString(data.currency, 10).toUpperCase() || 'USD';
  }

  if (data.location !== undefined) {
    clean.location = sanitizeString(data.location, 150);
  }

  if (data.vibe !== undefined) {
    clean.vibe = sanitizeString(data.vibe, 150);
  }

  if (data.notes !== undefined) {
    clean.notes = sanitizeString(data.notes, 1000);
  }

  return { isValid: errors.length === 0, errors, data: clean };
}

function validateBudgetItemInput(data, isUpdate = false) {
  const errors = [];
  const clean = {};

  if (!isUpdate || data.title !== undefined) {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Budget item title is required');
    } else {
      clean.title = sanitizeString(data.title, 100);
    }
  }

  if (!isUpdate || data.category !== undefined) {
    const catUpper = (data.category || '').toUpperCase();
    if (!ALLOWED_BUDGET_CATEGORIES.includes(catUpper)) {
      errors.push(`category must be one of: ${ALLOWED_BUDGET_CATEGORIES.join(', ')}`);
    } else {
      clean.category = catUpper;
    }
  }

  if (data.estimatedCost !== undefined) {
    const val = Number(data.estimatedCost);
    if (isNaN(val) || val < 0) errors.push('estimatedCost must be non-negative');
    else clean.estimatedCost = Math.round(val * 100) / 100;
  }

  if (data.actualCost !== undefined) {
    const val = Number(data.actualCost);
    if (isNaN(val) || val < 0) errors.push('actualCost must be non-negative');
    else clean.actualCost = Math.round(val * 100) / 100;
  }

  if (data.isPaid !== undefined) {
    clean.isPaid = Boolean(data.isPaid);
  }

  if (data.notes !== undefined) {
    clean.notes = sanitizeString(data.notes, 500);
  }

  return { isValid: errors.length === 0, errors, data: clean };
}

function validateTimelineItemInput(data, isUpdate = false) {
  const errors = [];
  const clean = {};

  if (!isUpdate || data.title !== undefined) {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Timeline item title is required');
    } else {
      clean.title = sanitizeString(data.title, 120);
    }
  }

  if (!isUpdate || data.phase !== undefined) {
    const phaseUpper = (data.phase || '').toUpperCase();
    if (!ALLOWED_TIMELINE_PHASES.includes(phaseUpper)) {
      errors.push(`phase must be one of: ${ALLOWED_TIMELINE_PHASES.join(', ')}`);
    } else {
      clean.phase = phaseUpper;
    }
  }

  if (data.targetDate !== undefined) clean.targetDate = sanitizeString(data.targetDate, 50);
  if (data.time !== undefined) clean.time = sanitizeString(data.time, 20);
  if (data.isCompleted !== undefined) clean.isCompleted = Boolean(data.isCompleted);
  if (data.notes !== undefined) clean.notes = sanitizeString(data.notes, 500);
  if (data.orderIndex !== undefined) clean.orderIndex = parseInt(data.orderIndex, 10) || 0;

  return { isValid: errors.length === 0, errors, data: clean };
}

function validateVendorItemInput(data, isUpdate = false) {
  const errors = [];
  const clean = {};

  if (!isUpdate || data.vendorName !== undefined) {
    if (!data.vendorName || typeof data.vendorName !== 'string' || data.vendorName.trim().length === 0) {
      errors.push('vendorName is required');
    } else {
      clean.vendorName = sanitizeString(data.vendorName, 100);
    }
  }

  if (!isUpdate || data.category !== undefined) {
    const catUpper = (data.category || '').toUpperCase();
    if (!ALLOWED_VENDOR_CATEGORIES.includes(catUpper)) {
      errors.push(`category must be one of: ${ALLOWED_VENDOR_CATEGORIES.join(', ')}`);
    } else {
      clean.category = catUpper;
    }
  }

  if (data.status !== undefined) {
    const stUpper = (data.status || '').toUpperCase();
    if (!ALLOWED_VENDOR_STATUSES.includes(stUpper)) {
      errors.push(`status must be one of: ${ALLOWED_VENDOR_STATUSES.join(', ')}`);
    } else {
      clean.status = stUpper;
    }
  }

  if (data.contactInfo !== undefined) clean.contactInfo = sanitizeString(data.contactInfo, 150);
  if (data.quotedPrice !== undefined && data.quotedPrice !== null) {
    const price = Number(data.quotedPrice);
    if (isNaN(price) || price < 0) errors.push('quotedPrice must be non-negative');
    else clean.quotedPrice = Math.round(price * 100) / 100;
  }
  if (data.notes !== undefined) clean.notes = sanitizeString(data.notes, 500);
  if (data.aiScreeningTips !== undefined) clean.aiScreeningTips = sanitizeString(data.aiScreeningTips, 500);

  return { isValid: errors.length === 0, errors, data: clean };
}

function validateAiConsultInput(data) {
  const errors = [];
  if (!data || !data.query || typeof data.query !== 'string' || data.query.trim().length === 0) {
    errors.push('Consultation query is required');
  } else if (data.query.trim().length > 600) {
    errors.push('Consultation query must not exceed 600 characters');
  }
  return {
    isValid: errors.length === 0,
    errors,
    data: { query: sanitizeString(data.query, 600) }
  };
}

module.exports = {
  sanitizeString,
  validateUUID,
  validateEventInput,
  validateBudgetItemInput,
  validateTimelineItemInput,
  validateVendorItemInput,
  validateAiConsultInput,
  ALLOWED_EVENT_TYPES,
  ALLOWED_BUDGET_CATEGORIES,
  ALLOWED_TIMELINE_PHASES,
  ALLOWED_VENDOR_CATEGORIES,
  ALLOWED_VENDOR_STATUSES,
  ALLOWED_IDEA_CATEGORIES,
  ALLOWED_COST_TIERS
};
