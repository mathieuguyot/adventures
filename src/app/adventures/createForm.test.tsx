/** @jest-environment jest-environment-jsdom */
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CreateForm from "./createForm";
import { act } from "react-dom/test-utils";

jest.mock("./common", () => {
    return {
        createAdventure: jest.fn(async (name: string) => {
            return name.includes("Ventoux");
        })
    };
});

describe("CreateFrom", () => {
    let input;
    let createButton;
    beforeEach(async () => {
        await act(async () => {
            await render(<CreateForm />);
        });
        input = screen.getByPlaceholderText("Adventure name");
        createButton = screen.getByRole("button", {
            name: /Create adventure/i
        });
    });

    it("button is disabled if no input", async () => {
        expect(createButton).toBeDisabled();
    });

    it("creation success", async () => {
        await act(async () => {
            await fireEvent.change(input, {
                target: { value: "La formidable montée du Mont Ventoux" }
            });
        });
        expect(createButton).toBeEnabled();
        await act(async () => {
            await fireEvent.click(createButton);
        });
        expect(input).toHaveDisplayValue("");
        expect(screen.queryAllByText("failed to create new adventure")).toHaveLength(0);
    });

    it("creation failed", async () => {
        await act(async () => {
            await fireEvent.change(input, {
                target: { value: "Random ride" }
            });
        });
        expect(createButton).toBeEnabled();
        await act(async () => {
            await fireEvent.click(createButton);
        });
        expect(input).toHaveDisplayValue("Random ride");
        expect(screen.queryAllByText("failed to create new adventure")).toHaveLength(1);
    });
});
