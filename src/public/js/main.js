/**
 * Main JavaScript File
 *
 * This file contains client-side JavaScript for your application.
 * Use vanilla JavaScript (no frameworks) for DOM manipulation and interactions.
 *
 * Common tasks:
 * - Form validation
 * - Interactive UI elements
 * - AJAX requests
 * - Event handling
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('Application initialized');

  // Example: Form validation
  initFormValidation();

  // Example: Interactive elements
  initInteractiveElements();
});

/**
 * Initialize form validation
 */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach((form) => {
    form.addEventListener('submit', function (e) {
      if (!validateForm(form)) {
        e.preventDefault();
      }
    });
  });
}

/**
 * Validate a form
 * @param {HTMLFormElement} form - Form element to validate
 * @returns {boolean} - True if form is valid
 */
function validateForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll('[required]');
  let pwdField = null;
  let confirmField = null;

  requiredFields.forEach((field) => {
    if (field.id === 'password') {
      pwdField ??= field;
    }
    if (field.id === 'newpassword') {
      pwdField = field;
    }
    if (field.id === 'confirm-pwd') {
      confirmField = field;
    }

    if (!field.value.trim()) {
      showError(field, 'This field is required');
      isValid = false;
    } else {
      clearError(field);
    }
  });

  if (pwdField && confirmField) {
    if (pwdField.value !== confirmField.value) {
      showError(confirmField, 'Passwords do not match');
      isValid = false;
    }
    else {
      clearError(confirmField);
    }
  }

  return isValid;
}

/**
 * Show error message for a field
 * @param {HTMLElement} field - Form field
 * @param {string} message - Error message
 */
function showError(field, message) {
  // Remove any existing error
  clearError(field);

  // Create error element
  const error = document.createElement('div');
  error.className = 'error-message';
  error.textContent = message;
  error.style.color = 'red';
  error.style.fontSize = '0.875rem';
  error.style.marginTop = '0.25rem';
  error.style.textAlign = 'center';

  // Insert after field
  field.parentNode.insertBefore(error, field.nextSibling);

  // Add error class to field
  field.classList.add('error');
  field.style.borderColor = 'red';
}

/**
 * Clear error message for a field
 * @param {HTMLElement} field - Form field
 */
function clearError(field) {
  const error = field.parentNode.querySelector('.error-message');
  if (error) {
    error.remove();
  }
  field.classList.remove('error');
  field.style.borderColor = '';
}

/**
 * Initialize interactive elements
 */
function initInteractiveElements() {
  // Example: Add smooth scrolling to anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  // Add functionality for sort buttons
  let sortMain = false;
  let sortUpcoming = false;
  let sortExpired = false;

  const sortMainBtn = document.getElementById("button-sort");
  const sortUpcomingBtn = document.getElementById("sort-upcoming");
  const sortExpiredBtn = document.getElementById("sort-expired");

  sortMainBtn?.addEventListener('click', function (e) {
    sortMain ^= true;
    const query = sortMain ? '?sort=true' : '';
    window.location.href = `/filter${query}`;
  });

  sortUpcomingBtn?.addEventListener('click', function (e) {
    sortUpcoming ^= true;
    const query = sortUpcoming ? '?sortupcoming=true' : '';
    window.location.href = `/dashboard/joined${query}`;
  });

  sortExpiredBtn?.addEventListener('click', function (e) {
    sortExpired ^= true;
    const query = sortExpired ? '?sortexpired=true' : '';
    window.location.href = `/dashboard/joined${query}`;
  });

  // Add log out functionality
  const logoutButton = document.getElementById("log-out");

  logoutButton?.addEventListener('click', function (e) {
    window.location.href = '/logout';
  });

  // Add change password functionality
  const changePwdButton = document.getElementById("change-pwd");

  changePwdButton?.addEventListener('click', function (e) {
    window.location.href = '/changepassword';
  });
}

/**
 * Make an AJAX request
 * @param {string} url - Request URL
 * @param {object} options - Request options (method, headers, body, etc.)
 * @returns {Promise<any>} - Response data
 */
/* eslint-disable no-unused-vars */
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

/**
 * Display a notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of message (success, error, info, warning)
 */
/* eslint-disable no-unused-vars */
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.padding = '1rem';
  notification.style.borderRadius = '4px';
  notification.style.backgroundColor =
    type === 'success'
      ? '#28a745'
      : type === 'error'
        ? '#dc3545'
        : type === 'warning'
          ? '#ffc107'
          : '#17a2b8';
  notification.style.color = 'white';
  notification.style.zIndex = '1000';
  notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

  // Add to page
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Export functions if using modules
// export { validateForm, makeRequest, showNotification };
