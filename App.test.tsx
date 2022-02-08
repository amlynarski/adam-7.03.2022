import { render } from "@testing-library/react-native";
import App from "./App";

describe("App", () => {
  it("should return container view", () => {
    const { getByTestId } = render(<App />);
    const appContainer = getByTestId("App-container");

    expect(appContainer).toBeDefined();
  });
});
