import posthog from "posthog-js";

const isEnabled = () => {
  return typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_POSTHOG_KEY;
};

export const analytics = {
  page: {
    view: (pageName: string, properties?: Record<string, any>) => {
      if (!isEnabled()) return;
      posthog.capture("page_viewed", {
        page_name: pageName,
        ...properties,
      });
    },
  },

  project: {
    viewed: (projectId: string, projectTitle: string) => {
      if (!isEnabled()) return;
      posthog.capture("project_viewed", {
        project_id: projectId,
        project_title: projectTitle,
      });
    },
    codeClicked: (projectId: string, projectTitle: string, url: string) => {
      if (!isEnabled()) return;
      posthog.capture("project_code_clicked", {
        project_id: projectId,
        project_title: projectTitle,
        github_url: url,
      });
    },
    liveClicked: (projectId: string, projectTitle: string, url: string) => {
      if (!isEnabled()) return;
      posthog.capture("project_live_clicked", {
        project_id: projectId,
        project_title: projectTitle,
        live_url: url,
      });
    },
    filtered: (technology: string) => {
      if (!isEnabled()) return;
      posthog.capture("projects_filtered", {
        filter_technology: technology,
      });
    },
  },

  contact: {
    emailClicked: (email: string) => {
      if (!isEnabled()) return;
      posthog.capture("contact_email_clicked", { email });
    },
    githubClicked: (url: string) => {
      if (!isEnabled()) return;
      posthog.capture("contact_github_clicked", { url });
    },
    linkedinClicked: (url: string) => {
      if (!isEnabled()) return;
      posthog.capture("contact_linkedin_clicked", { url });
    },
  },

  language: {
    changed: (from: string, to: string) => {
      if (!isEnabled()) return;
      posthog.capture("language_changed", {
        from_language: from,
        to_language: to,
      });
    },
  },

  theme: {
    changed: (theme: string) => {
      if (!isEnabled()) return;
      posthog.capture("theme_changed", { theme });
    },
  },

  admin: {
    login: (email: string) => {
      if (!isEnabled()) return;
      posthog.capture("admin_login", { email });
      posthog.identify(email, { email, role: "admin" });
    },
    logout: () => {
      if (!isEnabled()) return;
      posthog.capture("admin_logout");
      posthog.reset();
    },
    projectCreated: (projectId: string, projectTitle: string) => {
      if (!isEnabled()) return;
      posthog.capture("admin_project_created", {
        project_id: projectId,
        project_title: projectTitle,
      });
    },
    projectUpdated: (projectId: string, projectTitle: string) => {
      if (!isEnabled()) return;
      posthog.capture("admin_project_updated", {
        project_id: projectId,
        project_title: projectTitle,
      });
    },
    projectDeleted: (projectId: string, projectTitle: string) => {
      if (!isEnabled()) return;
      posthog.capture("admin_project_deleted", {
        project_id: projectId,
        project_title: projectTitle,
      });
    },
    settingsUpdated: () => {
      if (!isEnabled()) return;
      posthog.capture("admin_settings_updated");
    },
    aiDescriptionGenerated: (type: "short" | "long") => {
      if (!isEnabled()) return;
      posthog.capture("admin_ai_description_generated", {
        description_type: type,
      });
    },
  },

  chat: {
    opened: () => {
      if (!isEnabled()) return;
      posthog.capture("chat_opened");
    },
    closed: () => {
      if (!isEnabled()) return;
      posthog.capture("chat_closed");
    },
    messageSent: (messageLength: number) => {
      if (!isEnabled()) return;
      posthog.capture("chat_message_sent", {
        message_length: messageLength,
      });
    },
  },

  user: {
    identify: (userId: string, properties?: Record<string, any>) => {
      if (!isEnabled()) return;
      posthog.identify(userId, properties);
    },
    setProperties: (properties: Record<string, any>) => {
      if (!isEnabled()) return;
      posthog.people.set(properties);
    },
  },
};

export default analytics;