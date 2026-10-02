export type RouterOSVersion = 'v7' | 'v6';

export type FieldType = 'text' | 'number' | 'select' | 'boolean';

export interface SelectOption {
  label: string;
  value: string;
}

export interface GeneratorField {
  id: string;
  label: string;
  type: FieldType;
  defaultValue: string | number | boolean;
  placeholder?: string;
  helpText?: string;
  options?: SelectOption[];
  // If the field is only applicable to certain ROS versions:
  supportedVersions?: RouterOSVersion[];
}

export interface CompatibilityCheck {
  isCompatible: boolean;
  warningTitle?: string;
  warningMessage?: string;
}

export interface MikrotikGenerator {
  id: string;
  name: string;
  category?: string;
  description: string;
  supportedVersions: RouterOSVersion[];
  // Incompatibility note when the selected version isn't supported:
  incompatibilityNotice?: {
    unsupportedVersion: RouterOSVersion;
    title: string;
    message: string;
  };
  // Notes per version if syntax changed:
  versionNotes?: Partial<Record<RouterOSVersion, string>>;
  fields: GeneratorField[];
  // Dynamic compatibility check based on current field values:
  checkCompatibility?: (values: Record<string, any>, version: RouterOSVersion) => CompatibilityCheck;
  // Command generation:
  generateCommand: (values: Record<string, any>, version: RouterOSVersion) => string;
}
