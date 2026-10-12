import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import FormField from '../components/FormField';
import StatusBanner from '../components/StatusBanner';
import ConfirmDialog from '../components/ConfirmDialog';
import { COURSES, Course, MenuItem } from '../types';
import {
  FormErrors,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MenuItemFormValues,
  countErrors,
  normalisePrice,
  validateMenuItem,
} from '../utils/validation';
import { colors, fontSizes, radius, spacing } from '../theme';

interface MenuItemFormScreenProps {
  initialItem?: MenuItem; // provided when editing an existing dish
  existingNames: string[]; // names of the other dishes, to prevent duplicates
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
}

const EMPTY_FORM: MenuItemFormValues = { dishName: '', description: '', course: '', price: '' };

function toFormValues(item?: MenuItem): MenuItemFormValues {
  if (!item) return EMPTY_FORM;
  return {
    dishName: item.dishName,
    description: item.description,
    course: item.course,
    price: item.price.toFixed(2),
  };
}

// Screen 2: one form for both adding a new dish and editing an existing one.
export default function MenuItemFormScreen({ initialItem, existingNames, onSave, onCancel }: MenuItemFormScreenProps) {
  const isEditing = initialItem !== undefined;
  const [startingValues] = useState<MenuItemFormValues>(() => toFormValues(initialItem));
  const [values, setValues] = useState<MenuItemFormValues>(startingValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [discardVisible, setDiscardVisible] = useState(false);

  const hasChanges = (Object.keys(values) as (keyof MenuItemFormValues)[]).some(
    (field) => values[field] !== startingValues[field],
  );

  // Ask before throwing away typed changes; leave straight away if nothing was changed.
  const handleCancel = () => {
    if (hasChanges) {
      setDiscardVisible(true);
    } else {
      onCancel();
    }
  };

  // Updates one field and clears its error as soon as the chef starts correcting it.
  const updateField = <K extends keyof MenuItemFormValues>(field: K, value: MenuItemFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = () => {
    const formErrors = validateMenuItem(values, existingNames);
    setErrors(formErrors);
    if (countErrors(formErrors) > 0) {
      return;
    }

    onSave({
      // Keep the same id when editing so the existing dish is updated, not duplicated.
      id: initialItem?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      dishName: values.dishName.trim(),
      description: values.description.trim(),
      course: values.course as Course,
      price: parseFloat(normalisePrice(values.price)),
    });
  };

  const errorCount = countErrors(errors);

  return (
    <View style={styles.screen}>
      <AppHeader
        title={isEditing ? 'Edit Menu Item' : 'Add Menu Item'}
        subtitle={isEditing ? 'Update the dish details below' : 'Enter the dish details below'}
        onBack={handleCancel}
      />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          {errorCount > 0 ? (
            <StatusBanner
              type="error"
              message={`Please fix the ${errorCount === 1 ? 'highlighted field' : `${errorCount} highlighted fields`} before saving.`}
              style={styles.banner}
            />
          ) : null}

          <FormField label="Dish Name" required error={errors.dishName}>
            <TextInput
              style={[styles.input, errors.dishName ? styles.inputError : null]}
              placeholder="e.g. Grilled Kingklip"
              placeholderTextColor={colors.placeholder}
              value={values.dishName}
              onChangeText={(text) => updateField('dishName', text)}
              maxLength={MAX_NAME_LENGTH}
              autoCapitalize="words"
            />
          </FormField>

          <FormField
            label="Description"
            required
            error={errors.description}
            helper={`${values.description.length}/${MAX_DESCRIPTION_LENGTH}`}
          >
            <TextInput
              style={[styles.input, styles.multiline, errors.description ? styles.inputError : null]}
              placeholder="Short description of the dish..."
              placeholderTextColor={colors.placeholder}
              value={values.description}
              onChangeText={(text) => updateField('description', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
          </FormField>

          <FormField label="Course" required error={errors.course}>
            <View style={[styles.pickerWrapper, errors.course ? styles.inputError : null]}>
              <Picker
                selectedValue={values.course}
                onValueChange={(value) => updateField('course', value as Course | '')}
                style={styles.picker}
                dropdownIconColor={colors.text}
                accessibilityLabel="Select a course"
              >
                <Picker.Item label="Select course: Starter / Main / Dessert" value="" color={colors.placeholder} />
                {COURSES.map((option) => (
                  <Picker.Item key={option} label={option} value={option} color={colors.text} />
                ))}
              </Picker>
            </View>
          </FormField>

          <FormField label="Price (R)" required error={errors.price}>
            <TextInput
              style={[styles.input, errors.price ? styles.inputError : null]}
              placeholder="e.g. 185.00"
              placeholderTextColor={colors.placeholder}
              value={values.price}
              onChangeText={(text) => updateField('price', text)}
              keyboardType="numeric"
              maxLength={8}
            />
          </FormField>

          <View style={styles.buttons}>
            <AppButton label={isEditing ? 'Save Changes' : 'Save Menu Item'} onPress={handleSave} />
            <AppButton label="Cancel" onPress={handleCancel} variant="secondary" style={styles.cancelButton} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={discardVisible}
        title="Discard changes?"
        message="The details you entered have not been saved."
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        destructive
        onCancel={() => setDiscardVisible(false)}
        onConfirm={() => {
          setDiscardVisible(false);
          onCancel();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  form: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  banner: {
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    fontSize: fontSizes.body,
    color: colors.text,
  },
  multiline: {
    minHeight: 96,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },
  pickerWrapper: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    overflow: 'hidden',
  },
  picker: {
    color: colors.text,
    ...Platform.select({
      web: {
        height: 44,
        borderWidth: 0,
        paddingHorizontal: spacing.sm,
        backgroundColor: colors.surface,
        fontSize: fontSizes.body,
      },
      default: {},
    }),
  },
  buttons: {
    marginTop: spacing.xl,
  },
  cancelButton: {
    marginTop: spacing.md,
  },
});
