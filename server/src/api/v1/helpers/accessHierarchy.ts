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
  hierarchy: AccessLevel = AccessHierarchy,
): boolean => {
  const isDescendant = (level: AccessLevel, name: string): boolean => {
    if (level.name === name) {
      return true;
    }
    return level.children?.some((l) => isDescendant(l, name)) || false;
  };

  if (userLevel === requiredLevel) {
    return true;
  }
  if (hierarchy.name === requiredLevel) {
    return isDescendant(hierarchy, userLevel);
  }
  return (
    hierarchy.children?.some((l) =>
      isLevelSufficientForLevel(userLevel, requiredLevel, l),
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
