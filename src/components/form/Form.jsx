import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import useRoute from '../../hooks/use-route.ts';
import useFetch from '../../hooks/useFetch.js';
import { cn } from '../../lib/utils';
import Action from '../actions/Action.jsx';
import DateTimePicker from '../support/date-time-picker.jsx';
import FileUpload from '../support/file-upload.jsx';
import TextInput from '../support/text-input.jsx';
import Textarea from '../support/textarea.jsx';
import { Button } from '../ui/button.jsx';
import Actions from './actions.jsx';
import Select from './select.jsx';

const fieldComponentMap = {
  'text-input': TextInput,
  textarea: Textarea,
  select: Select,
  'date-picker': DateTimePicker,
  'time-picker': DateTimePicker,
  'datetime-picker': DateTimePicker,
  'file-upload': FileUpload,
  actions: Actions,
};

// Helper to extract all field definitions from wizard steps
const extractFieldsFromSteps = (steps) => {
  const allFields = [];
  steps?.forEach((step) => {
    if (step.fields) {
      allFields.push(...step.fields);
    }
  });
  return allFields;
};

// Store wizard step per record ID
const wizardStepCache = {};

export default function Form({
  seal,
  context,
  path,
  fields = [],
  state = {},
  wizard = null,
  recordId = null,
  onSuccess = null,
  onError = null,
  onFinish = null,
  onChange = null,
  footerActions = null,
  additionalFooterActions = (state) => [],
  className = '',
}) {
  const isWizard = wizard !== null && wizard.steps?.length > 0;

  // Get all fields - from wizard steps if wizard mode, otherwise regular fields
  const getAllFields = () => {
    if (isWizard) {
      return extractFieldsFromSteps(wizard.steps);
    }
    return fields;
  };

  const [currentFields, setCurrentFields] = useState(fields);
  const [currentSteps, setCurrentSteps] = useState(wizard?.steps || []);
  const [currentStep, setCurrentStep] = useState(() => {
    // Restore cached step for this record if available
    const cacheKey = recordId ?? 'new';
    return wizardStepCache[cacheKey] ?? 0;
  });
  const [formData, setFormData] = useState(() => {
    const initial = {};
    getAllFields().forEach((field) => {
      initial[field.name] = state[field.name] ?? field.default ?? '';
    });
    return initial;
  });

  const [errors, setErrors] = useState({});
  const [stepErrors, setStepErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [pendingRefresh, setPendingRefresh] = useState(false);
  const { fetch } = useFetch();
  const route = useRoute();

  // Wizard helpers
  const totalSteps = currentSteps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const step = currentSteps[currentStep];
  const skippable = wizard?.skippable ?? true;
  const showFooterActionsInLastStep = wizard?.showFooterActionsInLastStep ?? true;

  // Merge errors
  const mergedErrors = { ...errors, ...stepErrors };

  // Sync currentFields when fields prop changes
  useEffect(() => {
    setCurrentFields(fields);
  }, [fields]);

  // Sync wizard steps when wizard prop changes
  useEffect(() => {
    if (wizard?.steps) {
      setCurrentSteps(wizard.steps);
    }
  }, [wizard]);

  // Only sync formData when the state/fields props change
  useEffect(() => {
    const updatedData = {};
    getAllFields().forEach((field) => {
      updatedData[field.name] = state[field.name] ?? field.default ?? '';
    });
    setFormData(updatedData);
  }, [state, fields, wizard]);

  const findField = (fieldName) => {
    // Check regular fields first
    const topLevelField = currentFields.find((f) => f.name === fieldName);
    if (topLevelField) return topLevelField;

    // Check wizard steps
    if (isWizard) {
      for (const s of currentSteps) {
        const nestedField = s.fields?.find((f) => f.name === fieldName);
        if (nestedField) return nestedField;
      }
    }

    return null;
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error for this field when user starts typing
    if (mergedErrors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }

    // Check if this field is reactive and trigger form refresh
    const field = findField(fieldName);
    if (field?.reactive) {
      setPendingRefresh(true);
    }

    if (onChange) {
      onChange({
        ...formData,
        [fieldName]: value,
      });
    }
  };

  // Debounced refresh effect for reactive fields
  useEffect(() => {
    if (!pendingRefresh || !seal) return;

    const timeoutId = setTimeout(async () => {
      const response = await fetch(
        route('hewcode.mount'),
        {
          method: 'POST',
          body: {
            seal,
            context,
            call: {
              name: 'mount',
              params: {
                name: (path ? path + '.' : '') + 'getFormData',
                args: [formData],
              },
            },
          },
        },
        true,
      );

      if (response.ok) {
        const data = await response.json();
        // Update fields (visibility may have changed)
        setCurrentFields(data.fields);
        // Update wizard steps if present
        if (data.wizard?.steps) {
          setCurrentSteps(data.wizard.steps);
        }
        // Apply state modifications from backend (from onStateUpdate callbacks)
        if (data.state) {
          setFormData((prev) => ({
            ...prev,
            ...data.state,
          }));
        }
      }

      setPendingRefresh(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [pendingRefresh, formData, fetch, route, seal]);

  // Wizard step validation
  const validateStep = async (stepIndex) => {
    if (skippable) {
      return true;
    }

    setIsValidating(true);
    setStepErrors({});

    try {
      const response = await fetch(
        route('hewcode.mount'),
        {
          method: 'POST',
          body: {
            seal,
            context,
            call: {
              name: 'mount',
              params: {
                name: (path ? path + '.' : '') + 'validateWizardStep',
                args: [stepIndex, formData],
              },
            },
          },
        },
        true,
      );

      if (response.ok) {
        const data = await response.json();
        if (data.valid) {
          return true;
        } else {
          // Flatten error arrays to single messages
          const flatErrors = {};
          for (const [key, messages] of Object.entries(data.errors || {})) {
            flatErrors[key] = Array.isArray(messages) ? messages[0] : messages;
          }
          setStepErrors(flatErrors);
          return false;
        }
      }
    } catch (error) {
      console.error('Step validation failed:', error);
    } finally {
      setIsValidating(false);
    }

    return false;
  };

  const goToStep = async (index) => {
    if (index >= 0 && index < totalSteps) {
      // If moving forward and not skippable, validate current step first
      if (index > currentStep && !skippable) {
        const isValid = await validateStep(currentStep);
        if (!isValid) return;
      }
      setStepErrors({});
      setCurrentStep(index);
      // Cache the step for this record
      const cacheKey = recordId ?? 'new';
      wizardStepCache[cacheKey] = index;
    }
  };

  const goNext = async () => {
    if (!isLastStep) {
      if (!skippable) {
        const isValid = await validateStep(currentStep);
        if (!isValid) return;
      }
      setStepErrors({});
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Cache the step for this record
      const cacheKey = recordId ?? 'new';
      wizardStepCache[cacheKey] = nextStep;
    }
  };

  const goPrev = () => {
    if (!isFirstStep) {
      setStepErrors({});
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      // Cache the step for this record
      const cacheKey = recordId ?? 'new';
      wizardStepCache[cacheKey] = prevStep;
    }
  };

  const renderField = ({ attributes, name, type, ...field }) => {
    const FieldComponent = fieldComponentMap[type];

    if (!FieldComponent) {
      console.warn(`Unknown field type: ${type}`);
      return null;
    }

    const fieldAttributes = { ...attributes, ...field };

    return (
      <FieldComponent
        seal={seal}
        context={context}
        key={name}
        type={type}
        name={name}
        value={formData[name]}
        onChange={(value) => handleFieldChange(name, value)}
        error={mergedErrors[name]}
        {...fieldAttributes}
      />
    );
  };

  const renderFooterActions = () => {
    if (!footerActions?.length) return null;

    return footerActions.map((action) => (
      <Action
        key={action.name}
        seal={seal}
        onStart={() => setIsSubmitting(true)}
        onSuccess={(response) => {
          if (onSuccess) {
            onSuccess(action, formData, response);
          }
        }}
        onError={(serverErrors) => {
          if (action.name === 'submit') {
            setErrors(serverErrors);
          }
          if (onError) {
            onError(action, serverErrors, formData);
          }
        }}
        onFinish={() => {
          if (action.name === 'submit') {
            setIsSubmitting(false);
          }
          if (onFinish) {
            onFinish(action, formData);
          }
        }}
        {...action}
        additionalArgs={{ data: formData }}
      />
    ));
  };

  // Render wizard mode
  if (isWizard) {
    return (
      <form className="space-y-6">
        {/* Step indicators */}
        <nav aria-label="Progress" className="mb-8">
          <ol className="flex items-center">
            {currentSteps.map((s, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <li key={s.name} className={cn('relative', index !== totalSteps - 1 && 'flex-1 pr-8 sm:pr-20')}>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => goToStep(index)}
                      disabled={isValidating}
                      className={cn(
                        'relative flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                        isCompleted && 'bg-primary text-primary-foreground',
                        isCurrent && 'border-primary bg-background text-primary border-2',
                        !isCompleted && !isCurrent && 'border-muted bg-background text-muted-foreground border-2',
                      )}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                    </button>
                    <span
                      className={cn('ml-3 hidden text-sm font-medium sm:block', isCurrent && 'text-primary', !isCurrent && 'text-muted-foreground')}
                    >
                      {s.label || s.name}
                    </span>
                  </div>

                  {/* Connector line */}
                  {index !== totalSteps - 1 && (
                    <div
                      className={cn('absolute left-8 top-4 -ml-px h-0.5 w-full sm:left-32', isCompleted ? 'bg-primary' : 'bg-muted')}
                      style={{ width: 'calc(100% - 2rem)' }}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Step content */}
        <div className="wizard-step">
          {step?.description && <p className="text-muted-foreground mb-4 text-sm">{step.description}</p>}

          <div className={className || 'space-y-4'}>{step?.fields?.map((field) => renderField(field))}</div>
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          <Button type="button" variant="outline" onClick={goPrev} disabled={isFirstStep || isValidating} className={cn(isFirstStep && 'invisible')}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {!isLastStep && (
              <Button type="button" onClick={goNext} disabled={isValidating}>
                {isValidating ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
                Next
                {!isValidating && <ChevronRight className="ml-1 h-4 w-4" />}
              </Button>
            )}

            {(!showFooterActionsInLastStep || isLastStep) && renderFooterActions()}
          </div>
        </div>

        {additionalFooterActions(formData)}
      </form>
    );
  }

  // Render regular form mode
  return (
    <form className="space-y-6">
      <div className={className || 'space-y-4'}>{currentFields.map((field) => renderField(field))}</div>

      {footerActions?.length > 0 && <div className="flex justify-end gap-2">{renderFooterActions()}</div>}
      {additionalFooterActions(formData)}
    </form>
  );
}
