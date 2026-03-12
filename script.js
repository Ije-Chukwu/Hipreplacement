/**
 * Hip Replacement – Accessible JavaScript
 *
 * Features:
 *  - Mobile navigation toggle (aria-expanded)
 *  - Tab panel widget (ARIA tab pattern with keyboard support)
 *  - Accordion widget (ARIA disclosure pattern with keyboard support)
 *  - Contact form validation with accessible error messages
 *  - Polite live-region announcements for form status
 */

(function () {
  "use strict";

  /* -----------------------------------------------------------------------
     Utility helpers
  ----------------------------------------------------------------------- */

  /**
   * Announce a message to screen readers via a polite live region.
   * @param {string} message
   * @param {"polite"|"assertive"} politeness
   */
  function announce(message, politeness) {
    var region = document.getElementById("form-status");
    if (!region) return;
    region.textContent = "";
    region.className = "form-status";
    // Force re-announcement even if the text is the same
    requestAnimationFrame(function () {
      region.textContent = message;
      region.className =
        "form-status " + (politeness === "assertive" ? "error" : "success");
    });
  }

  /* -----------------------------------------------------------------------
     Footer year
  ----------------------------------------------------------------------- */
  var yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------------------------------
     Mobile navigation
  ----------------------------------------------------------------------- */
  var navToggle = document.getElementById("nav-toggle");
  var primaryNav = document.getElementById("primary-nav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navToggle.setAttribute(
        "aria-label",
        expanded ? "Open navigation menu" : "Close navigation menu"
      );
      primaryNav.classList.toggle("nav-open", !expanded);
    });

    // Close nav when a link is clicked (single-page navigation)
    primaryNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation menu");
        primaryNav.classList.remove("nav-open");
      });
    });

    // Close nav on Escape
    document.addEventListener("keydown", function (event) {
      if (
        event.key === "Escape" &&
        navToggle.getAttribute("aria-expanded") === "true"
      ) {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation menu");
        primaryNav.classList.remove("nav-open");
        navToggle.focus();
      }
    });
  }

  /* -----------------------------------------------------------------------
     Tab Widget (ARIA tabs pattern)
     Keyboard: Arrow Left/Right to navigate, Home/End, Space/Enter to activate
  ----------------------------------------------------------------------- */
  var tabList = document.querySelector('[role="tablist"]');

  if (tabList) {
    var tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));

    function activateTab(tab) {
      // Deactivate all tabs
      tabs.forEach(function (t) {
        t.setAttribute("aria-selected", "false");
        t.setAttribute("tabindex", "-1");
        t.classList.remove("tab-active");
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) {
          panel.hidden = true;
        }
      });

      // Activate selected tab
      tab.setAttribute("aria-selected", "true");
      tab.setAttribute("tabindex", "0");
      tab.classList.add("tab-active");
      tab.focus();

      var activePanel = document.getElementById(
        tab.getAttribute("aria-controls")
      );
      if (activePanel) {
        activePanel.hidden = false;
      }
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        activateTab(tab);
      });

      tab.addEventListener("keydown", function (event) {
        var newIndex;
        switch (event.key) {
          case "ArrowRight":
            event.preventDefault();
            newIndex = (index + 1) % tabs.length;
            activateTab(tabs[newIndex]);
            break;
          case "ArrowLeft":
            event.preventDefault();
            newIndex = (index - 1 + tabs.length) % tabs.length;
            activateTab(tabs[newIndex]);
            break;
          case "Home":
            event.preventDefault();
            activateTab(tabs[0]);
            break;
          case "End":
            event.preventDefault();
            activateTab(tabs[tabs.length - 1]);
            break;
          default:
            break;
        }
      });
    });
  }

  /* -----------------------------------------------------------------------
     Accordion Widget (ARIA disclosure pattern)
     Keyboard: Enter/Space to toggle, Arrow Up/Down to navigate between items
  ----------------------------------------------------------------------- */
  var accordion = document.getElementById("faq-accordion");

  if (accordion) {
    var triggers = Array.from(
      accordion.querySelectorAll(".accordion-trigger")
    );

    triggers.forEach(function (trigger, index) {
      trigger.addEventListener("click", function () {
        var expanded = trigger.getAttribute("aria-expanded") === "true";
        var panelId = trigger.getAttribute("aria-controls");
        var panel = document.getElementById(panelId);

        trigger.setAttribute("aria-expanded", String(!expanded));
        if (panel) {
          panel.hidden = expanded;
        }
      });

      trigger.addEventListener("keydown", function (event) {
        var newIndex;
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            newIndex = (index + 1) % triggers.length;
            triggers[newIndex].focus();
            break;
          case "ArrowUp":
            event.preventDefault();
            newIndex = (index - 1 + triggers.length) % triggers.length;
            triggers[newIndex].focus();
            break;
          case "Home":
            event.preventDefault();
            triggers[0].focus();
            break;
          case "End":
            event.preventDefault();
            triggers[triggers.length - 1].focus();
            break;
          default:
            break;
        }
      });
    });
  }

  /* -----------------------------------------------------------------------
     Contact Form Validation
  ----------------------------------------------------------------------- */
  var form = document.getElementById("contact-form");

  if (form) {
    /**
     * Show or clear an inline field error.
     * @param {HTMLElement} input
     * @param {string} message  Empty string to clear error.
     */
    function setFieldError(input, message) {
      var errorId = input.getAttribute("aria-describedby");
      // The describedby may contain multiple IDs; find the error span
      var errorSpanId = input.id + "-error";
      var errorSpan = document.getElementById(errorSpanId);

      if (!errorSpan) return;

      if (message) {
        errorSpan.textContent = message;
        input.setAttribute("aria-invalid", "true");
        input.classList.add("input-error");
      } else {
        errorSpan.textContent = "";
        input.removeAttribute("aria-invalid");
        input.classList.remove("input-error");
      }
    }

    /**
     * Validate a single field; returns an error message or empty string.
     * @param {HTMLElement} field
     * @returns {string}
     */
    function validateField(field) {
      var value = field.value.trim();

      if (field.required && !value) {
        return "This field is required.";
      }

      if (field.type === "email" && value) {
        // Basic RFC 5322 email shape check
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          return "Please enter a valid email address.";
        }
      }

      if (field.type === "tel" && value) {
        var telPattern = /^[+\d\s\-().]{7,20}$/;
        if (!telPattern.test(value)) {
          return "Please enter a valid phone number.";
        }
      }

      return "";
    }

    // Real-time validation on blur (after user leaves the field)
    form.querySelectorAll(".form-input").forEach(function (input) {
      input.addEventListener("blur", function () {
        setFieldError(input, validateField(input));
      });

      // Clear error on input to give immediate positive feedback
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") {
          setFieldError(input, validateField(input));
        }
      });
    });

    // Checkbox validation
    var privacyCheckbox = document.getElementById("privacy");
    if (privacyCheckbox) {
      privacyCheckbox.addEventListener("change", function () {
        var errorSpan = document.getElementById("privacy-error");
        if (errorSpan) {
          if (!privacyCheckbox.checked) {
            errorSpan.textContent = "You must accept the privacy policy.";
            privacyCheckbox.setAttribute("aria-invalid", "true");
          } else {
            errorSpan.textContent = "";
            privacyCheckbox.removeAttribute("aria-invalid");
          }
        }
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var errors = [];

      // Validate text/email/tel inputs
      form.querySelectorAll(".form-input").forEach(function (input) {
        var error = validateField(input);
        setFieldError(input, error);
        if (error) {
          errors.push({ field: input, message: error });
        }
      });

      // Validate privacy checkbox
      if (privacyCheckbox && !privacyCheckbox.checked) {
        var privacyMsg = "You must accept the privacy policy.";
        var privacyError = document.getElementById("privacy-error");
        if (privacyError) {
          privacyError.textContent = privacyMsg;
        }
        privacyCheckbox.setAttribute("aria-invalid", "true");
        errors.push({ field: privacyCheckbox, message: privacyMsg });
      }

      if (errors.length > 0) {
        // Move focus to first invalid field and announce
        errors[0].field.focus();
        announce(
          "The form has " +
            errors.length +
            " error" +
            (errors.length > 1 ? "s" : "") +
            ". Please correct them and try again.",
          "assertive"
        );
        return;
      }

      // All valid – simulate submission
      form.setAttribute("aria-busy", "true");
      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting…";
      }

      // Simulate async request (replace with real fetch() in production)
      setTimeout(function () {
        form.reset();
        form.removeAttribute("aria-busy");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit enquiry";
        }
        announce(
          "Thank you! Your enquiry has been submitted. We will be in touch within one working day.",
          "polite"
        );
        // Move focus to the status message so screen readers notice it
        var statusEl = document.getElementById("form-status");
        if (statusEl) {
          statusEl.setAttribute("tabindex", "-1");
          statusEl.focus();
        }
      }, 1200);
    });
  }
})();
