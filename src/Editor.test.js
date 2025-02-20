import { render, cleanup, screen, fireEvent, act, getByRole } from '@testing-library/react';
import Editor from "./Editor";

beforeEach(() => {
    // populate local storage
    localStorage.setItem(
      "listManager",
      JSON.stringify([
        { title: "List1", data: []},
        { title: "List2", data: []},
        { title: "List3", data: []}
      ])
    );
    localStorage.setItem("list", JSON.stringify({ title: "List1", data: []}));
    localStorage.setItem("completedTasks", JSON.stringify([]));

    jest.resetAllMocks();
});
  
afterEach(() => {
    // clean up local storage
    localStorage.clear();

    cleanup();
});
  
test("changes dropdown option successfully", async () => {
    const handleClickMenuMock = jest.fn();
  
    render(<Editor importOpen={false} editOpen={false} addOpen={false} deleteOpen={false} completedOpen={false}
                   handleClickMenu={handleClickMenuMock} />);

    // confirm default state
    expect(screen.getByText(/List1/i)).toBeInTheDocument(); // "/" for substring, i for case insensitive
  
    // open the dropdown
    const select = screen.getByRole("combobox");
    act(() => { // use act() when state changes
        fireEvent.mouseDown(select);
    });
  
    // ensure all menu options appear
    expect(screen.getByRole("option", { name: "List1" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "List2" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "List3" })).toBeInTheDocument();
  
    // select "List2"
    act(() => {
        const option2 = screen.getByRole("option", { name: "List2" });
        fireEvent.mouseDown(option2);
        option2.click();
    });
  
    // look at mock function
    expect(handleClickMenuMock).toHaveBeenCalled();
    expect(handleClickMenuMock.mock.calls[0][0].target.value).toBe("List2");
});
