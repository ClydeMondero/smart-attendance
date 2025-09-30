import useSettingStore from "@/store/useSettingStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Setting from "../Setting";

// --- Mocks ---
const mutateMock = vi.fn();

// mock mutation hook
vi.mock("@/hooks/useSettings", () => ({
  useTemplateSettings: () => ({
    mutate: mutateMock,
    isPending: false,
  }),
}));

// mock sync settings (no-op)
vi.mock("@/hooks/useSyncSettings", () => ({
  useSyncSettings: () => {},
}));

describe("Settings", () => {
  beforeEach(() => {
    // reset Zustand store before each test
    useSettingStore.setState({
      classAttendanceTemplate: "Class Attendance Template Content",
      schoolInTemplate: "School In Template Content",
      schoolOutTemplate: "School Out Template Content",
    });

    // reset mutation mock
    mutateMock.mockClear();
  });

  it("should render all tab triggers", () => {
    render(<Setting />);

    expect(
      screen.getByRole("tab", { name: /Class Attendance Template/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /School In Template/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /School Out Template/i })
    ).toBeInTheDocument();
  });

  it("should display correct content when switching tabs", async () => {
    const user = userEvent.setup();
    render(<Setting />);

    // Initial tab (Class)
    expect(
      screen.getByText(/Class Attendance Template Content/i)
    ).toBeInTheDocument();

    // Switch to School In
    await user.click(screen.getByRole("tab", { name: /School In Template/i }));
    expect(screen.getByText(/School In Template Content/i)).toBeInTheDocument();

    // Switch to School Out
    await user.click(screen.getByRole("tab", { name: /School Out Template/i }));
    expect(
      screen.getByText(/School Out Template Content/i)
    ).toBeInTheDocument();
  });

  it("should update Class Attendance template", async () => {
    const user = userEvent.setup();
    render(<Setting />);

    const textarea = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /Update Template/i });

    await user.clear(textarea);
    await user.type(textarea, "New Class Template");
    await user.click(button);

    expect(mutateMock).toHaveBeenCalledWith({
      templateSetting: "class_in_template",
      newValue: "New Class Template",
    });
  });

  it("should update School In template", async () => {
    const user = userEvent.setup();
    render(<Setting />);

    // switch to School In tab
    await user.click(screen.getByRole("tab", { name: /School In Template/i }));

    const textarea = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /Update Template/i });

    await user.clear(textarea);
    await user.type(textarea, "New School In Template");
    await user.click(button);

    expect(mutateMock).toHaveBeenCalledWith({
      templateSetting: "school_in_template",
      newValue: "New School In Template",
    });
  });

  it("should update School Out template", async () => {
    const user = userEvent.setup();
    render(<Setting />);

    // switch to School Out tab
    await user.click(screen.getByRole("tab", { name: /School Out Template/i }));

    const textarea = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /Update Template/i });

    await user.clear(textarea);
    await user.type(textarea, "New School Out Template");
    await user.click(button);

    expect(mutateMock).toHaveBeenCalledWith({
      templateSetting: "school_out_template",
      newValue: "New School Out Template",
    });
  });
});
