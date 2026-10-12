import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import { COURSES, Course, MenuItem } from '../types';
import { colors, fontSizes, radius, spacing } from '../theme';

interface AddMenuItemScreenProps {
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
}

// Holds an error message for each field (an empty object means the form is valid).
type FormErrors = {
  dishName?: string;
  description?: string;
  course?: string;
  price?: string;
};

const MAX_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 200;

// Screen 2: the form the chef uses to capture a new dish.
export default function AddMenuItemScreen({ onSave, onCancel }: AddMenuItemScreenProps) {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<Course | ''>('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  // Checks every field and returns the list of problems found.
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    const cleanPrice = price.trim().replace(',', '.'); // allow "185,00" as well as "185.00"

    if (dishName.trim().length === 0) {
      newErrors.dishName = 'Please enter the dish name.';
    } else if (dishName.trim().length < 2) {
      newErrors.dishName = 'The dish name must be at least 2 characters.';
    }

    if (description.trim().length === 0) {
      newErrors.description = 'Please enter a short description of the dish.';
    }

    if (course === '') {
      newErrors.course = 'Please select a course: Starter, Main Course or Dessert.';
    }

    if (cleanPrice.length === 0) {
      newErrors.price = 'Please enter the price.';
    } else if (!/^\d+(\.\d{1,2})?$/.test(cleanPrice)) {
      newErrors.price = 'Enter a valid price using numbers only, for example 185 or 185.50.';
    } else if (parseFloat(cleanPrice) <= 0) {
      newErrors.price = 'The price must be more than R0.00.';
    }

    return newErrors;
  };

  const handleSave = () => {
    const formErrors = validate();
    setErrors(formErrors);

    // Stop here if any field is invalid; the errors are shown under each field.
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const newItem: MenuItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      dishName: dishName.trim(),
      description: description.trim(),
      course: course as Course,
      price: parseFloat(price.trim().replace(',', '.')),
    };

    onSave(newItem);
  };

  // Clears a field's error as soon as the chef starts correcting it.
  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <View style={styles.screen}>
      <AppHeader title="Add Menu Item" subtitle="Enter the dish details below" onBack={onCancel} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
          {errorCount > 0 ? (
            <View style={styles.errorBanner} accessibilityLiveRegion="polite">
              <Text style={styles.errorBannerText}>
                Please fix the {errorCount === 1 ? 'highlighted field' : `${errorCount} highlighted fields`} before saving.
              </Text>
            </View>
          ) : null}

          {/* Dish Name */}
          <Text style={styles.label}>
            Dish Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.dishName && styles.inputError]}
            placeholder="e.g. Grilled Kingklip"
            placeholderTextColor={colors.placeholder}
            value={dishName}
            onChangeText={(text) => {
              setDishName(text);
              clearError('dishName');
            }}
            maxLength={MAX_NAME_LENGTH}
            autoCapitalize="words"
            returnKeyType="next"
          />
          {errors.dishName ? <Text style={styles.errorText}>{errors.dishName}</Text> : null}

          {/* Description */}
          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.multiline, errors.description && styles.inputError]}
            placeholder="Short description of the dish..."
            placeholderTextColor={colors.placeholder}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              clearError('description');
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
          <View style={styles.helperRow}>
            {errors.description ? (
              <Text style={[styles.errorText, styles.flex]}>{errors.description}</Text>
            ) : (
              <View style={styles.flex} />
            )}
            <Text style={styles.counter}>
              {description.length}/{MAX_DESCRIPTION_LENGTH}
            </Text>
          </View>

          {/* Course */}
          <Text style={styles.label}>
            Course <Text style={styles.required}>*</Text>
          </Text>
          <View style={[styles.pickerWrapper, errors.course && styles.inputError]}>
            <Picker
              selectedValue={course}
              onValueChange={(value) => {
                setCourse(value as Course | '');
                clearError('course');
              }}
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
          {errors.course ? <Text style={styles.errorText}>{errors.course}</Text> : null}

          {/* Price */}
          <Text style={styles.label}>
            Price (R) <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.price && styles.inputError]}
            placeholder="e.g. 185.00"
            placeholderTextColor={colors.placeholder}
            value={price}
            onChangeText={(text) => {
              setPrice(text);
              clearError('price');
            }}
            keyboardType="numeric"
            maxLength={8}
          />
          {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}

          <View style={styles.buttons}>
            <AppButton label="Save Menu Item" onPress={handleSave} />
            <AppButton label="Cancel" onPress={onCancel} variant="secondary" style={styles.cancelButton} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  errorBanner: {
    backgroundColor: colors.errorBackground,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    borderRadius: radius,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  errorBannerText: {
    fontSize: fontSizes.label,
    color: colors.error,
    fontWeight: '600',
  },
  label: {
    fontSize: fontSizes.label,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs + 2,
  },
  required: {
    color: colors.error,
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
  errorText: {
    marginTop: spacing.xs,
    fontSize: fontSizes.small + 1,
    color: colors.error,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  counter: {
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  buttons: {
    marginTop: spacing.xl,
  },
  cancelButton: {
    marginTop: spacing.md,
  },
});
