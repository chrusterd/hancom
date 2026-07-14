const MYNAME = '강하영'   // 자신의 이름으로 변경
const BASE_URL = `http://192.168.10.28:5000/hancom/${MYNAME}/users`
const HEADERS = { 'Authorization': 'HANCOM' }
const SEATS = 30   // 6열 5행

const grid = document.getElementById('grid')
const dataList = document.getElementById('dataList')
const addBtn = document.getElementById('addBtn')
const resetBtn = document.getElementById('resetBtn')
const initialBtn = document.getElementById('initialBtn')
const layoutBtn = document.getElementById('layoutBtn')

const NORMAL_ROSTER = [
    {id: 1, name: '강성원'},
    {id: 2, name: '강하영'},
    {id: 3, name: '김정아'},
    {id: 4, name: '김정현'},
    {id: 5, name: '김해냄'},
    {id: 6, name: '김효인'},
    {id: 7, name: '박진'},
    {id: 8, name: '안치호'},
    {id: 9, name: '양하은'},
    {id: 10, name: '유민성'},
    {id: 11, name: '이도연'},
    {id: 12, name: '이현우'},
    {id: 13, name: '임소정'},
    {id: 14, name: '전욱진'},
    {id: 15, name: '정기준'},
    {id: 16, name: '정선민'},
    {id: 17, name: '정유진'},
    {id: 18, name: '표후동'},
    {id: 19, name: '한유진'},
    {id: 20, name: '한윤지'}
]

const INITIAL_DATA = [
  { id: 1, name: '이순신' },
  { id: 2, name: '양하은' },
  { id: 3, name: '박순호' },
  { id: 4, name: '이도연' },
  { id: 5, name: '유민성' },
  { id: 6, name: '임소정' },
  { id: 7, name: '한윤지' },
  { id: 8, name: '정유진' },
  { id: 9, name: '박진' },
  { id: 10, name: '정선민' },
  { id: 11, name: '김정현' },
  { id: 12, name: '조수진' },
  { id: 13, name: '김해냄' },
  { id: 14, name: '김정아' },
  { id: 15, name: '강성원' },
  { id: 16, name: '홍길동' },
  { id: 17, name: '표후동' },
  { id: 18, name: '한유진' },
  { id: 19, name: '이현우' },
  { id: 20, name: '정기준' },
  { id: 21, name: '강하영' },
  { id: 22, name: '김영희' },
  { id: 23, name: '안치호' },
  { id: 24, name: '전욱진' },
  { id: 25, name: '김효인' },
  { id: 26, name: '최민준' }
]

const CURRENT_LAYOUT = [
  { id: 22, name: '강성원' },
  { id: 8, name: '강하영' },
  { id: 4, name: '김정아' },
  { id: 5, name: '김정현' },
  { id: 10, name: '김해냄' },
  { id: 21, name: '김효인' },
  { id: 11, name: '박진' },
  { id: 24, name: '안치호' },
  { id: 14, name: '양하은' },
  { id: 20, name: '유민성' },
  { id: 7, name: '이도연' },
  { id: 23, name: '이현우' },
  { id: 13, name: '임소정' },
  { id: 17, name: '전욱진' },
  { id: 15, name: '정기준' },
  { id: 16, name: '정선민' },
  { id: 9, name: '정유진' },
  { id: 18, name: '표후동' },
  { id: 2, name: '한유진' },
  { id: 3, name: '한윤지' }
]

let seatOrder = []   // 자리 배치 (인덱스 = 자리 번호). 서버가 id 오름차순으로 내려주는 순서를 그대로 사용
let isSwapping = false   // id 교환 도중에는 자동 새로고침이 끼어들지 않도록 막는 플래그

async function loadStudents() {
  if (isSwapping) return   // 자리 교환(id 변경) 중에는 폴링이 중간 상태를 덮어쓰지 않도록 건너뜀

  try {
    const res = await fetch(BASE_URL, { headers: HEADERS })
    const raw = await res.json()
    const students = raw.filter((s) => s.id !== null && s.id !== undefined)   // id 없는(오염된) 레코드 제외

    // id = 자리 번호. id가 N이면 N번 자리에 앉는다 (1~SEATS 범위 밖이거나 겹치면 빈자리에 배치)
    seatOrder = new Array(SEATS).fill(null)
    const leftover = []
    students.forEach((student) => {
      const seatIndex = Number(student.id) - 1
      if (Number.isInteger(seatIndex) && seatIndex >= 0 && seatIndex < SEATS && !seatOrder[seatIndex]) {
        seatOrder[seatIndex] = student
      } else {
        leftover.push(student)
      }
    })
    let nextEmpty = 0
    leftover.forEach((student) => {
      while (nextEmpty < SEATS && seatOrder[nextEmpty]) nextEmpty++
      if (nextEmpty < SEATS) seatOrder[nextEmpty] = student
    })

    renderGrid(seatOrder)
    renderDataList(raw)   // 필터링 없이 서버 원본 그대로 출력
  } catch (err) {
    console.error('loadStudents 오류:', err)
    alert('학생 목록을 불러오지 못했습니다. 콘솔을 확인하세요.')
  }
}

function renderDataList(students) {
  const lines = students.map((s) => `  { id: ${s.id}, name: '${s.name}' }`)
  dataList.textContent = `[\n${lines.join(',\n')}\n]`
}

const COLS = 6   // 좌 3열 + 통로 + 우 3열

function renderGrid(students) {
  grid.innerHTML = ''

  const screen = document.createElement('div')
  screen.className = 'screen'
  screen.textContent = 'SCREEN'
  grid.appendChild(screen)

  const teacherDesk = document.createElement('div')
  teacherDesk.className = 'teacher-desk'
  teacherDesk.innerHTML = '🖥️Teacher'
  grid.appendChild(teacherDesk)

  for (let i = 0; i < SEATS; i++) {
    const student = students[i]
    const seat = document.createElement('div')
    seat.dataset.seatIndex = i

    const row = Math.floor(i / COLS)
    const col = i % COLS
    const track = col < 3 ? col + 1 : col + 2   // 통로(4번째 트랙) 건너뛰기
    seat.style.gridRow = row + 2   // 1행은 스크린/교사 책상
    seat.style.gridColumn = track

    seat.addEventListener('dragenter', (e) => e.preventDefault())
    seat.addEventListener('dragover', (e) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    })
    seat.addEventListener('drop', (e) => {
      e.preventDefault()
      const fromIndex = Number(e.dataTransfer.getData('text/plain'))
      console.log('drop:', fromIndex, '->', i)
      swapSeats(fromIndex, i)
    })

    const seatId = document.createElement('div')
    seatId.className = 'seat-id'
    seatId.textContent = `${i + 1}`   // 자리 고유 번호(고정) - 학생이 여기 앉으면 서버 id도 이 값으로 맞춘다

    if (!student) {
      seat.className = 'seat empty'
      seat.appendChild(seatId)
      const emptyLabel = document.createElement('div')
      emptyLabel.textContent = '빈자리'
      seat.appendChild(emptyLabel)
      grid.appendChild(seat)
      continue
    }

    seat.className = 'seat'
    seat.draggable = true
    seat.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', String(i))
      seat.classList.add('dragging')
      console.log('dragstart:', i, student.name)
    })
    seat.addEventListener('dragend', () => seat.classList.remove('dragging'))

    const name = document.createElement('div')
    name.className = 'name'
    name.textContent = student.name
    name.addEventListener('click', () => editStudent(student))

    const del = document.createElement('div')
    del.className = 'del'
    del.textContent = '삭제'
    del.addEventListener('click', (e) => {
      e.stopPropagation()
      deleteStudent(student)
    })

    seat.appendChild(seatId)
    seat.appendChild(name)
    seat.appendChild(del)
    grid.appendChild(seat)
  }
}

async function swapSeats(fromIndex, toIndex) {
  if (fromIndex === toIndex || Number.isNaN(fromIndex)) return
  if (isSwapping) return   // 이전 교환이 끝나기 전에 또 시작하지 않도록

  const studentA = seatOrder[fromIndex]
  const studentB = seatOrder[toIndex]

  if (!studentA) return   // 빈자리를 집어서 옮기는 경우는 무시

  const temp = seatOrder[toIndex]
  seatOrder[toIndex] = seatOrder[fromIndex]
  seatOrder[fromIndex] = temp
  renderGrid(seatOrder)

  isSwapping = true
  try {
    if (studentB) {
      await swapIds(studentA, studentB)   // 둘 다 있으면 id 교환
    } else {
      await putId(studentA.id, toIndex + 1)   // 빈자리면 그 자리 번호로 id 변경
    }
  } catch (err) {
    console.error('자리 이동 오류:', err)
    alert('자리 이동 중 오류가 발생했습니다. 콘솔을 확인하세요.')
  } finally {
    isSwapping = false
  }
  loadStudents()   // 서버에 반영된 새 순서를 다시 불러와서 확인
}

// A와 B의 id를 실제로 맞바꾼다. 동시에 같은 id가 겹치지 않도록 임시 id를 거쳐간다.
async function swapIds(studentA, studentB) {
  const idA = studentA.id
  const idB = studentB.id
  const tempId = 900000 + Math.floor(Math.random() * 90000)   // 숫자 id (서버가 id를 Number로 변환하는 것으로 보임)

  try {
    await putId(idA, tempId)
    await putId(idB, idA)
    await putId(tempId, idB)
  } catch (err) {
    console.error('id 교환 오류:', err)
    alert('자리(=id) 교환 중 오류가 발생했습니다. 콘솔을 확인하세요.')
  }
}

async function putId(currentId, newId) {
  const res = await fetch(`${BASE_URL}/${currentId}`, {
    method: 'PUT',
    headers: { ...HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: newId })
  })
  const body = await res.clone().json().catch(() => res.text())
  console.log(`PUT id 교체 (${currentId} -> ${newId}):`, res.status, body)
  if (!res.ok) throw new Error(`id 교체 실패 (${currentId} -> ${newId}, status ${res.status})`)
}

async function editStudent(student) {
  const newName = prompt('새 이름을 입력하세요', student.name)
  if (!newName || newName === student.name) return

  await fetch(`${BASE_URL}/${student.id}`, {
    method: 'PUT',
    headers: { ...HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName })
  })

  loadStudents()
}

async function deleteStudent(student) {
  if (!confirm(`${student.name} 학생을 삭제할까요?`)) return

  // id가 null/undefined인 오염된 레코드는 id로 찾을 수 없으니 name으로 삭제 시도
  const key = (student.id === null || student.id === undefined) ? student.name : student.id

  try {
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: HEADERS
    })
    const body = await res.clone().json().catch(() => res.text())
    console.log(`DELETE 응답 (${student.name}, key ${key}):`, res.status, body)

    if (!res.ok) {
      alert(`삭제 실패 (status ${res.status})`)
      return
    }
  } catch (err) {
    console.error('deleteStudent 오류:', err)
    alert('서버 요청 중 오류가 발생했습니다. 콘솔을 확인하세요.')
    return
  }

  loadStudents()
}

async function addStudent() {
  const name = prompt('추가할 학생 이름을 입력하세요')
  if (!name) return

  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { ...HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    console.log('POST status:', res.status)
    console.log('POST response:', await res.clone().json().catch(() => res.text()))

    if (!res.ok) {
      alert(`추가 실패 (status ${res.status})`)
      return
    }
  } catch (err) {
    console.error('addStudent 오류:', err)
    alert('서버 요청 중 오류가 발생했습니다. 콘솔을 확인하세요.')
    return
  }

  loadStudents()
}

// current(서버의 null 아닌 데이터)를 앞에서부터 targetArray로 덮어쓴다. id(=자리)는 그대로 두고 이름만 교체.
async function overwriteRoster(targetArray, confirmMessage) {
  if (!confirm(confirmMessage)) return

  try {
    const res = await fetch(BASE_URL, { headers: HEADERS })
    const raw = await res.json()
    const current = raw.filter((s) => s.id !== null && s.id !== undefined)   // null 값은 무시

    // targetArray 항목이 '이름' 문자열이면 id는 순번(i+1), { id, name } 객체면 그 id를 그대로 사용
    const targets = targetArray.map((t, i) =>
      typeof t === 'string' ? { id: i + 1, name: t } : { id: t.id ?? i + 1, name: t.name }
    )

    // 1단계: 기존 id들을 임시 대역(800000~)으로 옮겨서 목표 id 재부여 시 충돌을 막는다
    for (let i = 0; i < current.length; i++) {
      await putId(current[i].id, 800000 + i)
      current[i].id = 800000 + i
    }

    // 2단계: 앞에서부터 목표 id와 이름으로 덮어쓴다 (남으면 삭제, 부족하면 추가)
    const count = Math.max(current.length, targets.length)
    for (let i = 0; i < count; i++) {
      const cur = current[i]
      const target = targets[i]

      if (cur && target) {
        await fetch(`${BASE_URL}/${cur.id}`, {
          method: 'PUT',
          headers: { ...HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: target.id, name: target.name })
        })
      } else if (cur && !target) {
        await fetch(`${BASE_URL}/${cur.id}`, { method: 'DELETE', headers: HEADERS })
      } else if (!cur && target) {
        // 서버가 자동 부여한 id를 받아서 목표 id로 바로 교체
        const postRes = await fetch(BASE_URL, {
          method: 'POST',
          headers: { ...HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: target.name })
        })
        const created = await postRes.json().catch(() => null)
        const newId = created && (created.id ?? created.user?.id)
        if (newId !== null && newId !== undefined && newId !== target.id) {
          await putId(newId, target.id)
        }
      }
    }
  } catch (err) {
    console.error('overwriteRoster 오류:', err)
    alert('처리 중 오류가 발생했습니다. 콘솔을 확인하세요.')
  }

  loadStudents()
}

function keepNormalRosterOnly() {
  return overwriteRoster(NORMAL_ROSTER, '현재 명단을 앞에서부터 정상 명단으로 덮어쓸까요?')
}

function resetToInitial() {
  return overwriteRoster(INITIAL_DATA, '현재 명단을 앞에서부터 처음 데이터로 덮어쓸까요?')
}

function applyCurrentLayout() {
  return overwriteRoster(CURRENT_LAYOUT, '서버 데이터를 현재 배치도(지정된 id + 이름)로 덮어쓸까요?')
}

addBtn.addEventListener('click', addStudent)
resetBtn.addEventListener('click', keepNormalRosterOnly)
initialBtn.addEventListener('click', resetToInitial)
layoutBtn.addEventListener('click', applyCurrentLayout)

loadStudents()
setInterval(loadStudents, 3000)   // 3초마다 서버 데이터 다시 조회해서 새로고침
