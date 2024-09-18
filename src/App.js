import { Box, Container } from '@mui/material';
import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Editor from './Editor';
import Customizer from './Customizer';
import Wallet from './Wallet';
import initialShop from './InitialShop';
import initialCloset from './InitialCloset';

function App() {
  // populate local storage with an initial list
  // this should go in a useEffect hook so it only gets updated on mount
  // BUT that has seriously given me endless problems... (main thing being it just doesn't run??)
  const initialList = [
    {
      title: "My First List",
      data: [
        {
          name: "This is your first task!",
          complete: false
        },
        {
          name: "This is your second task!",
          complete: false
        }
      ]
    }
  ]
  if (!localStorage.getItem("listManager")) {
    localStorage.setItem("listManager", JSON.stringify(initialList));
  }
  if (!localStorage.getItem("completedTasks")) {
    localStorage.setItem("completedTasks", JSON.stringify([]));
  }
  if (!localStorage.getItem("list")) {
    localStorage.setItem("list", JSON.stringify(initialList[0]));
  }
  if (!localStorage.getItem("wallet")) {
    localStorage.setItem("wallet", JSON.stringify(0));
  }
  if (!localStorage.getItem("day")) {
    localStorage.setItem("day", JSON.stringify(new Date().getDate()));
  }
  if (!localStorage.getItem("dailyMoney")) {
    if (localStorage.getItem("listManager")) { // presumably already mounted once--why are you deleting the daily limit hmm?
      localStorage.setItem("dailyMoney", JSON.stringify(100));
    } else {
      localStorage.setItem("dailyMoney", JSON.stringify(0));
    }
  }
  if (!localStorage.getItem("wearing")) {
    localStorage.setItem("wearing", JSON.stringify([initialCloset[0]]));
  }
  if (!localStorage.getItem("closet")) {
    // let tempShop = JSON.parse(localStorage.getItem("shop"));
    // if (tempShop && tempShop.length !== initialShop.length) {
    //   let newCloset = [...initialCloset];
    //   initialShop.forEach((item) => {
    //     let found = tempShop.findIndex((i) => i.filename === item.filename);
    //     if (found === -1) {
    //       newCloset.push(item);
    //     }
    //   })
    //   localStorage.setItem("closet", JSON.stringify(newCloset));
    // }
    // else {
    //   localStorage.setItem("closet", JSON.stringify(initialCloset));
    // }
    localStorage.setItem("closet", JSON.stringify(initialCloset));
    localStorage.setItem("shop", JSON.stringify(initialShop));
    localStorage.setItem("wearing", JSON.stringify([initialCloset[0]]));
  }
  if (!localStorage.getItem("shop")) {
    // let tempCloset = JSON.parse(localStorage.getItem("closet"));
    // if (tempCloset && (tempCloset.length) !== initialCloset.length) {
    //   let newShop = [...initialShop];
    //   tempCloset.forEach((item) => {
    //     console.log(newShop);
    //     let found = initialShop.findIndex((i) => i.filename === item.filename);
    //     if (found !== -1) {
    //       newShop.splice(found, 1);
    //     }
    //   })
    //   localStorage.setItem("closet", JSON.stringify(newShop));
    // } else {
    //   localStorage.setItem("shop", JSON.stringify(initialShop));
    // }
    localStorage.setItem("closet", JSON.stringify(initialCloset));
    localStorage.setItem("shop", JSON.stringify(initialShop));
    localStorage.setItem("wearing", JSON.stringify([initialCloset[0]]));
  }

  let listManager = JSON.parse(localStorage.getItem("listManager"));
  const initList = JSON.parse(localStorage.getItem("list"));
  const initCompletedTasks = JSON.parse(localStorage.getItem("completedTasks"));
  const initMoney = parseInt(localStorage.getItem("wallet"));
  const initDailyMoney = parseInt(localStorage.getItem("dailyMoney"));
  // customization stuffs
  const initWearing = JSON.parse(localStorage.getItem("wearing"));
  const initCloset = JSON.parse(localStorage.getItem("closet"));
  const initShop = JSON.parse(localStorage.getItem("shop"));

  /* --------------------════ ⋆★⋆ ════-------------------- */

  // for editor
  const [list, setList] = useState(initList);
  const [completedTasks, setCompletedTasks] = useState(initCompletedTasks);
  const [editOpen, setEditOpen] = useState(false);
  const [nameExists, setNameExists] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [noAddListOpen, setNoAddListOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [noDeleteListOpen, setNoDeleteListOpen] = useState(false);
  const [maxTasksReached, setMaxTasksReached] = useState(false);
  const [isEmptyTask, setIsEmptyTask] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [maxTasksRestored, setMaxTasksRestored] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importedFile, setImportedFile] = useState(null);
  const [invalidFileOpen, setInvalidFileOpen] = useState(false);
  const [tooLongFileOpen, setTooLongFileOpen] = useState(false);
  const [repNameFileOpen, setRepNameFileOpen] = useState(false);

  const [money, setMoney] = useState(initMoney);
  const [dailyMoney, setDailyMoney] = useState(initDailyMoney);
  const moneyCap = 10000;
  const dailyMoneyCap = 100;

  const [wearing, setWearing] = useState(initWearing);
  const [closet, setCloset] = useState(initCloset);
  const [shop, setShop] = useState(initShop);
  const [currentItem, setCurrentItem] = useState(null);

  const [lastCheckTime, setLastCheckTime] = useState(0);

  /* --------------------════ ⋆★⋆ ════-------------------- */

  useEffect(() => {
    const day = new Date().getDate();
    const recordedDay = parseInt(localStorage.getItem("day"));
    if (day !== recordedDay) {
      setDailyMoney(0);
      localStorage.setItem("day", day);
      localStorage.setItem("dailyMoney", JSON.stringify(0));
    }
  }, []);

  useEffect(() => {
    if (closet.length + shop.length !== initialShop.length) { // if there's a new item added
      console.log("new item in shop woop de doo");
      initialShop.forEach(item => {
        const foundInCloset = closet.find((element) => element.filename === item.filename);
        const foundInShop = shop.find((element) => element.filename === item.filename);
        if (!foundInCloset && !foundInShop) {
          const newShop = [
            ...shop,
            item
          ]
          setShop(newShop);
          localStorage.setItem('shop', JSON.stringify(newShop));
        }
      });
    }
  }, [closet, shop]);

  /* --------------------════ ⋆★⋆ ════-------------------- */

  const handleClickMenu = (e) => {
    const newList = listManager.find((element) => element.title === e.target.value);
    setList(newList);
    localStorage.setItem("list", JSON.stringify(newList));
  }

  const handleEditOpen = (bool) => {
    setEditOpen(bool);
    setNameExists(false);
  }
  const handleEditList = (newName) => {
    const name = listManager.find((element) => element.title === newName);
    if (name) { // if the name already exists
      setNameExists(true);
    }
    else {
      setNameExists(false);
      setEditOpen(false); // for closing the dialog
      const index = listManager.findIndex((element) => element.title === list.title);
      const newList = {
        ...list,
        title: newName
      }
      setList(newList);
      //"list.title = newName" works but is a mutable update--not recommended for state variables
      localStorage.setItem("list", JSON.stringify(newList));
      listManager[index] = newList;
      localStorage.setItem("listManager", JSON.stringify(listManager));
    }
  }

  const handleAddOpen = (bool) => {
    setAddOpen(bool);
    setNameExists(false);
  }
  const handleAddListButton = () => {
    if (listManager.length >= 10) {
      setNoAddListOpen(true);
      setTimeout(() => {
        setNoAddListOpen(false);
      }, 3000);
    }
    else {
      setAddOpen(true);
    }
  }
  const handleAddListDialog = (newName) => {
    const name = listManager.find((element) => element.title === newName);
    if (name) {
      setNameExists(true);
    }
    else {
      setNameExists(false);
      setAddOpen(false);
      const newList = {
        title: newName,
        data: []
      }
      setList(newList);
      localStorage.setItem("list", JSON.stringify(newList));
      listManager.push(newList);
      localStorage.setItem("listManager", JSON.stringify(listManager));
    }
  }
  const handleAddExistingList = (newList) => {
    const name = listManager.find((element) => element.title === newList.title);
    if (!name) {
      setList(newList);
      localStorage.setItem("list", JSON.stringify(newList));
      listManager.push(newList);
      localStorage.setItem("listManager", JSON.stringify(listManager));
    }
    else {
      setRepNameFileOpen(true);
      setTimeout(() => {
        setRepNameFileOpen(false);
      }, 3000);
    }
  }

  const handleDeleteListButton = () => {
    if (listManager.length <= 1) {
      setNoDeleteListOpen(true);
      setTimeout(() => {
        setNoDeleteListOpen(false);
      }, 3000);
    }
    else {
      setDeleteOpen(true);
    }
  }
  const handleDeleteListDialog = () => {
    setNoDeleteListOpen(false);
    setDeleteOpen(false);
    const index = listManager.findIndex((element) => element.title === list.title);
    let newList = null;
    if (index === 0) {
        newList = listManager[index + 1];
    }
    else {
        newList = listManager[index - 1];
    }
    setList(newList);
    localStorage.setItem("list", JSON.stringify(newList));
    listManager.splice(index, 1);
    localStorage.setItem("listManager", JSON.stringify(listManager));
  }

  const handleEditTask = (e, index, page, itemsPerPage) => {
    const newIndex = index + (itemsPerPage * (page - 1));
    const listIndex = listManager.findIndex((element) => element.title === list.title);

    // an "immutable" update; can also use mapping (but it's complicated & not really shorter)
    let newList = {...list};
    let newData = [...newList.data];
    newData[newIndex] = {
      ...newData[newIndex],
      name: e.target.value
    };
    newList.data = newData;
    
    setList(newList);
    localStorage.setItem("list", JSON.stringify(newList));
    listManager[listIndex] = newList;
    localStorage.setItem("listManager", JSON.stringify(listManager));
  }

  const handleAddTask = (newTask) => {
    if (!newTask) {
      setIsEmptyTask(true);
      setTimeout(() => {
        setIsEmptyTask(false);
      }, 3000);
    }
    else if (list.data.length >= 15) {
      setMaxTasksReached(true);
      setTimeout(() => {
        setMaxTasksReached(false);
      }, 3000);
    }
    else {
      const listIndex = listManager.findIndex((element) => element.title === list.title);

      let newList = {...list};
      const newData = [
        ...newList.data,
        { name: newTask, complete: false }
      ]
      newList.data = newData;

      setList(newList);
      localStorage.setItem("list", JSON.stringify(newList));
      listManager[listIndex] = newList;
      localStorage.setItem("listManager", JSON.stringify(listManager));
    }
  }

  const handleDeleteTask = (index, page, itemsPerPage) => {
    const newIndex = index + (itemsPerPage * (page - 1));
    const listIndex = listManager.findIndex((element) => element.title === list.title);

    let newList = {...list};
    let newData = [...newList.data];
    newData.splice(newIndex, 1);
    newList.data = newData;
      
    setList(newList);
    localStorage.setItem("list", JSON.stringify(newList));
    listManager[listIndex] = newList;
    localStorage.setItem("listManager", JSON.stringify(listManager));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }

  const handleCheckTask = (e, index, page, itemsPerPage) => {
    const currentTime = Date.now();
    if (currentTime - lastCheckTime > 300) { // prevents you from checking too fast (so setInterval can do its thing)
      setLastCheckTime(currentTime);

      const newIndex = index + (itemsPerPage * (page - 1));
      const listIndex = listManager.findIndex((element) => element.title === list.title);

      let newList = { ...list };
      let newData = [...newList.data];
      newData[newIndex] = {
        ...newData[newIndex],
        complete: e.target.checked
      };
      newList.data = newData;

      setList(newList);
      localStorage.setItem("list", JSON.stringify(newList));
      listManager[listIndex] = newList;
      localStorage.setItem("listManager", JSON.stringify(listManager));

      // money increment
      let oldMoney = money
      let newMoney = money;
      let newDailyMoney = dailyMoney;
      const completedIndex = completedTasks.findIndex((element) => element.name === newData[newIndex].name)
      let newCompletedTasks = [...completedTasks];

      if (e.target.checked) {
        newCompletedTasks = [
          ...newCompletedTasks,
          newData[newIndex]
        ];
        if (newCompletedTasks.length > 15) { // auto clears old tasks
          newCompletedTasks.shift();
        }

        if (money < moneyCap && dailyMoney < dailyMoneyCap) { // money completely freezes when you hit either cap
          const counter = setInterval(() => {
            newMoney += 1;
            setMoney(newMoney);
            if (newMoney === oldMoney + 10) {
              clearInterval(counter);
            }
          }, 20);
          newDailyMoney = dailyMoney + 10;
          setDailyMoney(newDailyMoney);

          // setInterval does not seem to update local variables properly so we do not use them for updating
          localStorage.setItem("wallet", JSON.stringify(oldMoney + 10));
        }
      }
      else {
        newCompletedTasks.splice(completedIndex, 1);
        if (money < moneyCap && dailyMoney < dailyMoneyCap) {
          const counter = setInterval(() => {
            newMoney -= 1;
            setMoney(newMoney);
            if (newMoney === oldMoney - 10) {
              clearInterval(counter);
            }
          }, 20);
          newDailyMoney = dailyMoney - 10;
          setDailyMoney(newDailyMoney);

          localStorage.setItem("wallet", JSON.stringify(oldMoney - 10));
        }
      }
      setCompletedTasks(newCompletedTasks);

      localStorage.setItem("dailyMoney", JSON.stringify(newDailyMoney));
    }
  }

  const handleClearList = () => {
    const listIndex = listManager.findIndex((element) => element.title === list.title);

    let newList = {...list};
    const newData = list.data.filter((item) => item.complete === false);
    newList.data = newData;

    setList(newList);
    localStorage.setItem("list", JSON.stringify(newList));
    listManager[listIndex] = newList;
    localStorage.setItem("listManager", JSON.stringify(listManager));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }

  const handleCompletedOpen = (bool) => {
    setCompletedOpen(bool);
    setMaxTasksRestored(false);
  }
  const handleEmptyTrash = () => {
    const emptyArray = []
    setCompletedTasks(emptyArray);
    localStorage.setItem("completedTasks", JSON.stringify(emptyArray));
    setMaxTasksRestored(false);
  }
  const handleRestoreTask = (restoredTask, index, page, itemsPerPage) => {
    const newIndex = index + (itemsPerPage * (page - 1)); // new index accounting for pagination
    
    if (list.data.length >= 15) {
      setMaxTasksRestored(true);
    }
    else {
      setMaxTasksRestored(false);

      const listIndex = listManager.findIndex((element) => element.title === list.title);

      let newList = {...list};
      const newData = [
        ...newList.data,
        { name: restoredTask, complete: false }
      ]
      newList.data = newData;

      setList(newList);
      localStorage.setItem("list", JSON.stringify(newList));
      listManager[listIndex] = newList;
      localStorage.setItem("listManager", JSON.stringify(listManager));

      let newCompletedTasks = [...completedTasks]
      newCompletedTasks.splice(newIndex, 1);

      setCompletedTasks(newCompletedTasks);
      localStorage.setItem("completedTasks", JSON.stringify(newCompletedTasks));
    }
  }

  const handleImport = (file, replace) => {
    const reader = new FileReader();

    reader.onload = (event) => {
        const fileContents = event.target.result; // file contents as text
        let fileObject = null;
        try { // try-catch block to account for invalid files (will throw error on JSON.parse())
          fileObject = JSON.parse(fileContents);

          if (replace) {
            if (fileObject.length <= 10) { // shouldn't be possible when exporting but in case someone inputs a faulty file...
              setList(fileObject[0]);
              localStorage.setItem("list", JSON.stringify(fileObject[0]));
              listManager = fileObject;
              localStorage.setItem("listManager", JSON.stringify(listManager));
            }
            else {
              setTooLongFileOpen(true);
              setTimeout(() => {
                setTooLongFileOpen(false);
              }, 3000);
            }
          } 
          else {
            if (fileObject.length + listManager.length <= 10) {
                for (let i = 0; i < fileObject.length; i++) {
                    handleAddExistingList(fileObject[i]);
                }
            }
            else {
              setTooLongFileOpen(true);
              setTimeout(() => {
                setTooLongFileOpen(false);
              }, 3000);
            }
          }
        }
        catch (e) {
          console.log(e.stack);
          setInvalidFileOpen(true);
          setTimeout(() => {
            setInvalidFileOpen(false);
          }, 3000);
        }
    };

    reader.readAsText(file);

    setImportOpen(false);
    setImportedFile(null);
  }

  const handleExport = () => {
    const stringifiedLists = JSON.stringify(listManager, null, 4); // 4 for indentation
    const file = new Blob([stringifiedLists], { type: 'text/plain' });

    // anchor link
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "list.txt";

    // simulate link click
    document.body.appendChild(element); // required for this to work in FireFox
    element.click();
    element.parentNode.removeChild(element); // reset
  }

  const handleClickShopItem = (filename) => {
    const item = shop.find((element) => element.filename === filename);
    if (currentItem && filename === currentItem.filename) { // if deselecting
      const newWearing = JSON.parse(localStorage.getItem("wearing")); // go back to original outfit
      setWearing(newWearing);
      setCurrentItem(null);
    } else {
      if (wearing.some((element) => element.category === item.category) || item.category === 'character') { // if exists, replace
        const index = wearing.findIndex((element) => element.category === item.category);
        let newWearing = [...wearing];
        newWearing[index] = item;
        setWearing(newWearing);
      } else { // if doesn't exist, add
        const newWearing = [
          ...wearing,
          item
        ]
        setWearing(newWearing);
      }
      setCurrentItem(item);
    }
  }
  const handleBuy = () => {
    if (money >= currentItem.price) {
      // before, i did findIndex() + splice() but this seems to work just fine
      const newShop = shop.filter((item) => item.filename !== currentItem.filename);
      setShop(newShop);
      const newCloset = [
        ...closet,
        currentItem
      ]
      setCloset(newCloset);

      const newMoney = money - currentItem.price;
      setMoney(newMoney);

      const newWearing = wearing.filter((item) => item.filename !== currentItem.filename);
      setWearing(newWearing);
      setCurrentItem(null);

      localStorage.setItem("shop", JSON.stringify(newShop));
      localStorage.setItem("closet", JSON.stringify(newCloset));
      localStorage.setItem("wallet", JSON.stringify(newMoney));
    }
  }
  const handleClickClosetItem = (filename) => {
    let newWearing;
    const item = closet.find((element) => element.filename === filename);
    if (item.category === 'character') { // does not account for deselecting bc user must have one character
      newWearing = [...wearing];
      newWearing[0] = item;
      setWearing(newWearing);
      setCurrentItem(item);
    } else {
      if (wearing.some((element) => element.filename === item.filename)) { // if already wearing
        newWearing = wearing.filter((element) => element.filename !== item.filename);
        setWearing(newWearing);
        setCurrentItem(null);
      } else {
        if (wearing.some((element) => element.category === item.category)) {
          const index = wearing.findIndex((element) => element.category === item.category);
          newWearing = [...wearing];
          newWearing[index] = item;
          setWearing(newWearing);
        } else {
          newWearing = [
            ...wearing,
            item
          ]
          setWearing(newWearing);
        }
        setCurrentItem(item);
      }
    }
    localStorage.setItem("wearing", JSON.stringify(newWearing));
  }

  /* --------------------════ ⋆★⋆ ════-------------------- */

  return (
    <Container className="App" maxWidth='lg'>
      <Box sx={{ width: 1160, display: 'flex', justifyContent: 'space-between' }}>
        <Header text="CheckMate" />
        <Wallet value={money} />
      </Box>
      <Box sx={{ // outer brown box
        bgcolor: '#837370',
        borderRadius: '32px',
        height: 580, // height is hard-coded because i do not want it to stretch vertically
        width: 1100, // used to be minwidth but i don't want to deal w resizing anymore...
        marginTop: '16px',
        padding: '30px',
        display: 'flex'
      }}>
        <Editor
          handleClickMenu={handleClickMenu}

          editOpen={editOpen}
          handleEditOpen={handleEditOpen}
          nameExists={nameExists}
          handleEditList={handleEditList}

          addOpen={addOpen}
          noAddListOpen={noAddListOpen}
          handleAddOpen={handleAddOpen}
          handleAddListButton={handleAddListButton}
          handleAddListDialog={handleAddListDialog}
          handleAddExistingList={handleAddExistingList}

          deleteOpen={deleteOpen}
          noDeleteListOpen={noDeleteListOpen}
          setDeleteOpen={setDeleteOpen}
          handleDeleteListButton={handleDeleteListButton}
          handleDeleteListDialog={handleDeleteListDialog}

          handleEditTask={handleEditTask}
          maxTasksReached={maxTasksReached}
          isEmptyTask={isEmptyTask}
          handleAddTask={handleAddTask}
          handleDeleteTask={handleDeleteTask}
          handleCheckTask={handleCheckTask}

          handleClearList={handleClearList}
          completedOpen={completedOpen}
          handleCompletedOpen={handleCompletedOpen}
          handleEmptyTrash={handleEmptyTrash}
          handleRestoreTask={handleRestoreTask}
          maxTasksRestored={maxTasksRestored}

          importOpen={importOpen}
          setImportOpen={setImportOpen}
          handleImport={handleImport}
          importedFile={importedFile}
          setImportedFile={setImportedFile}
          handleExport={handleExport}
          invalidFileOpen={invalidFileOpen}
          tooLongFileOpen={tooLongFileOpen}
          repNameFileOpen={repNameFileOpen}
        />
        <Customizer
          currentItem={currentItem}
          setCurrentItem={setCurrentItem}
          handleClickShopItem={handleClickShopItem}
          wearing={wearing}
          setWearing={setWearing}
          handleBuy={handleBuy}
          handleClickClosetItem={handleClickClosetItem}
        />
      </Box>
    </Container>
  );
}

export default App;