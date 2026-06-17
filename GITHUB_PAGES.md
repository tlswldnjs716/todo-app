# GitHub Pages 배포 가이드

배포 완료 후 URL: **https://tlswldnjs716.github.io/todo-app/**

---

## 1단계 — GitHub에 새 레포 생성

1. https://github.com/new 접속
2. 아래와 같이 입력:
   - **Repository name**: `todo-app`
   - **Visibility**: Public (Pages는 Public이어야 무료)
   - "Add a README file" 체크 **해제**
3. **Create repository** 클릭

---

## 2단계 — 로컬에서 todo 파일 push

터미널에서 아래 명령어 순서대로 실행:

```bash
# todo 폴더로 이동
cd /home/ubuntu/work/kosa-vibecoding-2026-3rd/src/exercise/tlswldnjs716/day02/todo

# 새 git 레포 초기화
git init

# 원격 레포 연결
git remote add origin https://github.com/tlswldnjs716/todo-app.git

# 파일 전체 추가
git add index.html app.js style.css stitch.png

# 커밋
git commit -m "feat: initial todo app with Supabase"

# main 브랜치로 push
git branch -M main
git push -u origin main
```

---

## 3단계 — GitHub Pages 활성화

1. https://github.com/tlswldnjs716/todo-app 접속
2. **Settings** 탭 클릭
3. 좌측 메뉴 **Pages** 클릭
4. **Branch** 항목에서 `main` 선택, 폴더는 `/ (root)` 유지
5. **Save** 클릭

---

## 4단계 — 배포 확인

- 저장 후 약 1~2분 대기
- https://tlswldnjs716.github.io/todo-app/ 접속
- 페이지가 뜨면 배포 완료!

> Settings → Pages 화면에서 초록색 "Your site is live at ..." 메시지가 뜨면 배포된 것입니다.

---

## 이후 코드 수정 시 반영 방법

```bash
cd /home/ubuntu/work/kosa-vibecoding-2026-3rd/src/exercise/tlswldnjs716/day02/todo
git add .
git commit -m "update: 변경 내용 설명"
git push origin main
```

push 후 1~2분 뒤 자동으로 반영됩니다.
