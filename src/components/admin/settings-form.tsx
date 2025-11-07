"use client";

import { Loader2, Upload, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "@/i18n/client";
import {
  getPortfolioSettings,
  updatePortfolioSettings,
} from "@/lib/firebase/services/settings";
import type {
  MultilingualText,
  PortfolioSettingsInput,
} from "@/lib/firebase/types";

const LANGUAGES = [
  { code: "pt-BR", label: "Português" },
  { code: "en-US", label: "English" },
  { code: "es-ES", label: "Español" },
] as const;

export function SettingsForm() {
  const t = useTranslations();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [bio, setBio] = useState<MultilingualText>({
    "en-US": "",
    "pt-BR": "",
    "es-ES": "",
  });

  const [role, setRole] = useState<MultilingualText>({
    "en-US": "",
    "pt-BR": "",
    "es-ES": "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getPortfolioSettings();

      if (settings) {
        setPhotoUrl(settings.photo || "");
        setName(settings.name || "");
        setEmail(settings.email || "");
        setGithub(settings.github || "");
        setLinkedin(settings.linkedin || "");
        setBio(settings.bio);
        setRole(settings.role);
      }
    } catch (error) {
      toast.error(t("common.error"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.info(t("admin.settings.upload"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error(t("admin.settings.fillAllRequired"));
      return;
    }

    const bioEmpty = Object.values(bio).some((v) => !v.trim());
    const roleEmpty = Object.values(role).some((v) => !v.trim());

    if (bioEmpty || roleEmpty) {
      toast.error(t("admin.settings.fillBioAndRole"));
      return;
    }

    try {
      setSaving(true);

      const data: PortfolioSettingsInput = {
        photo: photoUrl || undefined,
        name,
        email,
        github: github,
        linkedin: linkedin,
        bio,
        role,
      };

      await updatePortfolioSettings(data);
      toast.success(t("admin.settings.updateSuccess"));
    } catch (error) {
      toast.error(t("common.error"));
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.settings.photo")}</CardTitle>
          <CardDescription>
            {t("admin.settings.photoDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            {photoUrl ? (
              <div className="relative">
                <img
                  src={photoUrl || "/placeholder.svg"}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={() => setPhotoUrl("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {t("admin.settings.photoRecommendation")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.settings.basicInfo")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">{t("admin.settings.name")} *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("admin.settings.namePlaceholder")}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">{t("admin.settings.contactEmail")} *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("admin.settings.emailPlaceholder")}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.settings.roleTitle")}</CardTitle>
          <CardDescription>
            {t("admin.settings.roleDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pt-BR">
            <TabsList className="grid w-full grid-cols-3">
              {LANGUAGES.map((lang) => (
                <TabsTrigger key={lang.code} value={lang.code}>
                  {lang.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {LANGUAGES.map((lang) => (
              <TabsContent
                key={lang.code}
                value={lang.code}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor={`role-${lang.code}`}>
                    {t("admin.settings.roleTitle")} ({lang.label}) *
                  </Label>
                  <Input
                    id={`role-${lang.code}`}
                    value={role[lang.code]}
                    onChange={(e) =>
                      setRole({ ...role, [lang.code]: e.target.value })
                    }
                    placeholder={t("admin.settings.rolePlaceholder")}
                    required
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.settings.bioTitle")}</CardTitle>
          <CardDescription>
            {t("admin.settings.bioDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pt-BR">
            <TabsList className="grid w-full grid-cols-3">
              {LANGUAGES.map((lang) => (
                <TabsTrigger key={lang.code} value={lang.code}>
                  {lang.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {LANGUAGES.map((lang) => (
              <TabsContent
                key={lang.code}
                value={lang.code}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor={`bio-${lang.code}`}>
                    Bio ({lang.label}) *
                  </Label>
                  <Textarea
                    id={`bio-${lang.code}`}
                    value={bio[lang.code]}
                    onChange={(e) =>
                      setBio({ ...bio, [lang.code]: e.target.value })
                    }
                    placeholder={t("admin.settings.bioPlaceholder")}
                    rows={4}
                    required
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.settings.socialLinks")}</CardTitle>
          <CardDescription>
            {t("admin.settings.socialDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="github">{t("admin.settings.github")}</Label>
            <Input
              id="github"
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder={t("admin.settings.githubPlaceholder")}
            />
          </div>

          <div>
            <Label htmlFor="linkedin">{t("admin.settings.linkedin")}</Label>
            <Input
              id="linkedin"
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder={t("admin.settings.linkedinPlaceholder")}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={loadSettings}
          disabled={saving}
        >
          {t("admin.settings.cancel")}
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("admin.settings.saving")}
            </>
          ) : (
            t("admin.settings.saveSettings")
          )}
        </Button>
      </div>
    </form>
  );
}