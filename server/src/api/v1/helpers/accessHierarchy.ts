import { SecurityRequirement } from "openapi-backend";

interface AccessLevel {
  name: string;
  children?: AccessLevel[];
}

const AccessHierarchy: AccessLevel = {
  name: "logged-in",
  children: [
    {
      name: "customer",
      children: [
        {
          name: "user",
        },
        {
          name: "organization",
        },
      ],
    },
    {
      name: "employee",
      children: [
        {
          name: "manager",
        },
      ],
    },
  ],
};

// In tree like AccessHierarchy, check if requiredLevel is an ancestor of (or same) userLevel
const isLevelSufficientForLevel = (
  userLevel: string,
  requiredLevel: string,
): boolean => {
  if (userLevel === requiredLevel) {
    return true;
  }
  const level = AccessHierarchy.children?.find((l) => l.name === userLevel);
  if (!level) {
    return false;
  }
  return (
    level.children?.some((l) =>
      isLevelSufficientForLevel(l.name, requiredLevel),
    ) || false
  );
};

const isLevelSufficientForSecurityRequirements = (
  userLevel: string,
  securityRequirements: SecurityRequirement[] | undefined,
): boolean => {
  if (!securityRequirements) {
    return true;
  }
  return securityRequirements.every((requirement) => {
    return requirement.jwt.some((requiredLevel) =>
      isLevelSufficientForLevel(userLevel, requiredLevel),
    );
  });
};

export { AccessHierarchy, isLevelSufficientForSecurityRequirements };
