"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";

export type NewTeamMember = {
  name: string;
  contact: string;
  skills: string[];
  weeklyCapacity: number;
  employmentType: string;
};

type AddTeamMemberDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: NewTeamMember) => void;
};

const initialSkills = ["Accounting basics", "Customer service"];

export function AddTeamMemberDialog({
  isOpen,
  onClose,
  onSave,
}: AddTeamMemberDialogProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [weeklyCapacity, setWeeklyCapacity] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [skills, setSkills] = useState(initialSkills);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    const trimmedName = name.trim();
    const trimmedContact = contact.trim();
    const capacity = Number(weeklyCapacity);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedContact);
    const isPhone = /^\+?[\d\s().-]{7,}$/.test(trimmedContact);

    if (!trimmedName) nextErrors.name = "Enter the team member’s full name.";
    if (!trimmedContact) {
      nextErrors.contact = "Enter an email address or phone number.";
    } else if (!isEmail && !isPhone) {
      nextErrors.contact = "Enter a valid email address or phone number.";
    }
    if (
      weeklyCapacity &&
      (!Number.isFinite(capacity) || capacity <= 0 || capacity > 168)
    ) {
      nextErrors.capacity = "Enter a capacity between 1 and 168 hours.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({
      name: trimmedName,
      contact: trimmedContact,
      skills,
      weeklyCapacity: weeklyCapacity ? capacity : 40,
      employmentType,
    });
    setName("");
    setContact("");
    setWeeklyCapacity("");
    setSkills(initialSkills);
    setEmploymentType("Full-time");
    setErrors({});
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/20 px-4 pt-[max(24px,23vh)] sm:px-6 max-[700px]:items-center max-[700px]:py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby="add-member-title"
        aria-modal="true"
        className="relative w-full max-w-[729px] rounded-[18px] bg-white px-[22px] pb-[28px] pt-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.2)] sm:px-[27px] sm:pb-[28px] sm:pt-[28px]"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <h2
          className="text-[21px] font-bold leading-[28px] text-[#305f49] sm:text-[23px]"
          id="add-member-title"
        >
          Add team member
        </h2>
        <form className="mt-[14px]" onSubmit={submit}>
          <div className="grid gap-x-4 gap-y-[10px] sm:grid-cols-2 sm:gap-x-4">
            <label className="block text-[13px] font-semibold leading-5 text-[#223f30] sm:text-[15px]">
              Full name
              <input
                className="mt-[5px] h-[42px] w-full rounded-[7px] border border-[#cbd7d0] px-[11px] text-[15px] font-normal text-[#223f30] outline-none placeholder:text-[#777] focus:border-[#4b7f5b] focus:ring-1 focus:ring-[#4b7f5b]"
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Dilini M."
                value={name}
              />
              {errors.name && (
                <span className="mt-1 block text-xs text-[#8b1d1d]">
                  {errors.name}
                </span>
              )}
            </label>
            <label className="block text-[13px] font-semibold leading-5 text-[#223f30] sm:text-[15px]">
              Email or phone
              <input
                autoComplete="email"
                className="mt-[5px] h-[42px] w-full rounded-[7px] border border-[#cbd7d0] px-[11px] text-[15px] font-normal text-[#223f30] outline-none placeholder:text-[#777] focus:border-[#4b7f5b] focus:ring-1 focus:ring-[#4b7f5b]"
                onChange={(event) => setContact(event.target.value)}
                placeholder="Contact"
                value={contact}
              />
              {errors.contact && (
                <span className="mt-1 block text-xs text-[#8b1d1d]">
                  {errors.contact}
                </span>
              )}
            </label>
          </div>

          <fieldset className="mt-[16px]">
            <legend className="text-[13px] font-semibold leading-5 text-[#223f30] sm:text-[15px]">
              Skills
            </legend>
            <div className="mt-[5px] flex min-h-[27px] flex-wrap gap-[7px]">
              {skills.map((skill) => (
                <span
                  className="inline-flex h-[27px] items-center gap-1 rounded-full bg-[#e1eee5] px-[11px] text-[13px] text-[#305f49]"
                  key={skill}
                >
                  {skill}
                  <button
                    aria-label={`Remove ${skill}`}
                    className="font-bold hover:text-[#8b1d1d]"
                    onClick={() =>
                      setSkills((current) =>
                        current.filter((item) => item !== skill),
                      )
                    }
                    type="button"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              aria-label="Add a skill"
              className="mt-[7px] h-[42px] w-full rounded-[7px] border border-[#cbd7d0] px-[11px] text-[15px] text-[#223f30] outline-none placeholder:text-[#777] focus:border-[#4b7f5b] focus:ring-1 focus:ring-[#4b7f5b]"
              onChange={(event) => setSkillInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  const skill = skillInput.trim();
                  if (
                    skill &&
                    !skills.some(
                      (item) => item.toLowerCase() === skill.toLowerCase(),
                    )
                  ) {
                    setSkills((current) => [...current, skill]);
                  }
                  setSkillInput("");
                }
              }}
              placeholder="Add a skill and press Enter"
              value={skillInput}
            />
          </fieldset>

          <div className="mt-[17px] grid gap-x-4 gap-y-[10px] sm:grid-cols-2">
            <label className="block text-[13px] font-semibold leading-5 text-[#223f30] sm:text-[15px]">
              Weekly capacity (hours)
              <input
                className="mt-[5px] h-[42px] w-full rounded-[7px] border border-[#cbd7d0] px-[11px] text-[15px] font-normal text-[#223f30] outline-none placeholder:text-[#777] focus:border-[#4b7f5b] focus:ring-1 focus:ring-[#4b7f5b]"
                max={168}
                min={1}
                onChange={(event) => setWeeklyCapacity(event.target.value)}
                placeholder="e.g. 40"
                type="number"
                value={weeklyCapacity}
              />
              {errors.capacity && (
                <span className="mt-1 block text-xs text-[#8b1d1d]">
                  {errors.capacity}
                </span>
              )}
            </label>
            <label className="block text-[13px] font-semibold leading-5 text-[#223f30] sm:text-[15px]">
              Employment type
              <div className="relative mt-[5px]">
                <select
                  className="h-[42px] w-full appearance-none rounded-[7px] border border-[#cbd7d0] bg-white px-[14px] pr-8 text-[15px] font-normal text-[#305f49] outline-none focus:border-[#4b7f5b] focus:ring-1 focus:ring-[#4b7f5b]"
                  onChange={(event) => setEmploymentType(event.target.value)}
                  value={employmentType}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                </select>
                <Image
                  alt=""
                  className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2"
                  height={9}
                  src="/figma/organization-overview/08237.svg"
                  width={10}
                />
              </div>
            </label>
          </div>

          <div className="mt-[21px] flex justify-end gap-[12px]">
            <button
              className="h-[41px] rounded-[9px] border border-[#cbd7d0] bg-white px-[18px] text-[14px] font-semibold text-[#305f49] hover:bg-[#f5f8f6]"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="h-[41px] rounded-[9px] bg-[#4a7d5c] px-[18px] text-[14px] font-semibold text-white hover:bg-[#3f704f]"
              type="submit"
            >
              Save member
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
