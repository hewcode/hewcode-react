import { router } from '@inertiajs/react';
import fireToasts from '../utils/fire-toasts.js';

/**
 * Wrapper around fetch to handle common tasks like setting headers, parsing JSON, and error handling.
 */
export default async function _fetch(url, options = {}, hewcode, vanilla = false, toast, setHewcode) {
  if (vanilla) {
    return fetchJson(url, options, hewcode, toast);
  }

  return fetchWithInertia(url, options, hewcode, toast, setHewcode);
}

// Helper to detect files in object
function containsFiles(obj) {
  if (obj instanceof File || obj instanceof FileList) return true;
  if (Array.isArray(obj)) {
    return obj.some((item) => containsFiles(item));
  }
  if (obj && typeof obj === 'object') {
    return Object.values(obj).some((value) => containsFiles(value));
  }
  return false;
}

// Helper to convert nested object to FormData
function convertToFormData(obj, formData = new FormData(), parentKey = '') {
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof File) {
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item instanceof File) {
          formData.append(`${formKey}[]`, item);
        } else if (item && typeof item === 'object') {
          convertToFormData({ [index]: item }, formData, formKey);
        } else {
          formData.append(`${formKey}[${index}]`, item === null ? '' : item);
        }
      });
    } else if (value && typeof value === 'object' && !(value instanceof File)) {
      convertToFormData(value, formData, formKey);
    } else if (value !== null && value !== undefined) {
      formData.append(formKey, value === null ? '' : value);
    }
  });

  return formData;
}

function fetchJson(url, options, hewcode, toast) {
  const hasFiles = options.body && containsFiles(options.body);

  const defaultHeaders = {
    Accept: 'application/json',
    'X-CSRF-TOKEN': hewcode.csrfToken, // ensures we are always using a fresh CSRF token.
  };

  // Only set Content-Type for JSON, let browser set it for FormData
  if (!hasFiles) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  let body;
  if (hasFiles) {
    body = convertToFormData(options.body);
  } else {
    body = options.body ? JSON.stringify(options.body) : null;
  }

  const fetchOptions = {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    body,
  };

  return fetch(url, fetchOptions)
    .then(async (response) => {
      // if this is a result of dd() from Laravel, show the value evaluated in a full screen debugger div
      if (hewcode.developerMode && response.headers.get('Content-Type')?.includes('text/html')) {
        response.text().then((html) => {
          showDebugScreen(html);
        });
      }

      // Try to parse JSON and fire toasts if available
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        try {
          const data = await response.clone().json();
          if (data.toasts && Array.isArray(data.toasts)) {
            fireToasts(data.toasts, toast);
          }
        } catch (e) {
          // Silently fail if JSON parsing fails
        }
      }

      if (response.ok && options.onSuccess) {
        options.onSuccess(response);
      }

      if (!response.ok && options.onError) {
        options.onError(response);
      }

      return response;
    })
    .catch((error) => {
      if (options.onError) {
        options.onError(error);
      }
    })
    .finally(() => {
      if (options.onFinish) {
        options.onFinish();
      }
    });
}

function fetchWithInertia(url, options = {}, hewcode, toast, setHewcode) {
  const inertiaOptions = {
    method: options.method || 'get',
    data: options.body || {},
    headers: {
      'X-CSRF-TOKEN': hewcode.csrfToken,
      ...(options.headers || {}),
    },
    preserveScroll: true,
    onSuccess: (page) => {
      if (page.props.hewcode) {
        setHewcode(page.props.hewcode);
      }
      fireToasts(page.props.hewcode.toasts, toast);
    },
  };

  return router.visit(url, inertiaOptions);
}

function showDebugScreen(html) {
  if (!html.includes('<script> Sfdump = window.Sfdump || (function (doc) {')) {
    return;
  }

  const debugDiv = document.createElement('div');
  debugDiv.style.position = 'fixed';
  debugDiv.style.inset = '80px';
  debugDiv.style.backgroundColor = '#080808';
  debugDiv.style.padding = '20px';
  debugDiv.style.zIndex = '9999';
  debugDiv.style.border = '1px solid #444';
  debugDiv.id = 'hewcode-debugger';

  // a overflow auto container for the html content
  const contentDiv = document.createElement('div');
  contentDiv.style.overflow = 'auto';
  contentDiv.innerHTML = html;
  debugDiv.appendChild(contentDiv);

  // X button to close the debugger
  const closeButton = document.createElement('button');
  closeButton.innerText = 'X';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '-12px';
  closeButton.style.right = '-12px';
  closeButton.style.backgroundColor = '#ff4848';
  closeButton.style.border = 'none';
  closeButton.style.color = 'white';
  closeButton.style.width = '30px';
  closeButton.style.height = '30px';
  closeButton.style.cursor = 'pointer';
  closeButton.onclick = () => {
    debugDiv.remove();
  };
  debugDiv.appendChild(closeButton);

  // Remove any existing debugger div
  const existingDiv = document.getElementById('hewcode-debugger');
  if (existingDiv) {
    existingDiv.remove();
  }

  document.body.appendChild(debugDiv);
}
