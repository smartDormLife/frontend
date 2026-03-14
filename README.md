# 🏠 슬기로운 긱사생활 (Smart Dorm Life) - Frontend

> [cite_start]**아주대학교 기숙사생들을 위한 통합 커뮤니티 플랫폼** [cite: 26]
> [cite_start]배달비 분담, 공동구매, 중고거래를 하나의 서비스에서 해결하세요. [cite: 28, 29]

---

## 📝 프로젝트 개요
[cite_start]기존 기숙사생들이 겪던 **정보 분산(에브리타임, 카카오톡 등)**과 **접근성 저하** 문제를 해결하기 위해 기획되었습니다. [cite: 27, 38]  
[cite_start]게시글 작성부터 파티 모집, 그리고 모집 완료 시 자동으로 생성되는 채팅방까지 이어지는 매끄러운 사용자 경험을 제공합니다. [cite: 30, 54]

## 🚀 핵심 기능
* [cite_start]**기숙사 기반 폐쇄형 커뮤니티**: 본인이 소속된 건물의 게시판에만 접근하여 보안과 신뢰도를 높였습니다. [cite: 134, 270]
* [cite_start]**자동화된 파티 매칭**: 인원 모집 완료 시 `Socket.IO`를 통해 즉시 실시간 채팅방이 개설됩니다. [cite: 91, 210]
* [cite_start]**카테고리별 특화 게시판**: 배달, 공동구매, 중고거래, 그리고 전체 공개되는 택시 카테고리를 제공합니다. [cite: 219, 263]
* [cite_start]**실시간 상태 관리**: `TanStack Query`를 사용하여 파티 참여 현황을 실시간으로 동기화합니다. [cite: 260, 297]

## 🛠 Tech Stack
### **Core**
* [cite_start]**Library**: React (Vite) [cite: 260]
* [cite_start]**Language**: **TypeScript** (안정적인 데이터 처리 및 에러 방지) [cite: 260]
* [cite_start]**State Management**: TanStack Query (Server State), React Hooks [cite: 260, 297]
* [cite_start]**Real-time**: Socket.io-client [cite: 259, 285]

### **Why TypeScript?**
[cite_start]보안 전공자로서 **데이터 무결성**을 보장하기 위해 채택했습니다. 
* 코드를 실행하기 전 타입 에러를 방지하여 런타임 버그를 최소화했습니다.
* [cite_start]팀 협업 시 API 데이터 구조를 명확하게 공유하여 개발 속도를 높였습니다. [cite: 310]

## 🏗 시스템 아키텍처 및 설계 특징
* [cite_start]**API 인터셉터**: JWT 기반 인증 체계를 구축하여 모든 요청에 보안 토큰을 자동으로 포함합니다. [cite: 268]
* [cite_start]**Soft Delete**: 채팅방 탈퇴 시 `is_active` 필드를 활용하여 메시지 이력을 유지하는 데이터 보존 전략을 사용했습니다. [cite: 281, 312]
* [cite_start]**캐시 무효화 전략**: `onSuccess` 시점에 관련 쿼리 키를 무효화하여 UI와 서버 데이터의 일관성을 유지합니다. [cite: 298]

## 📸 주요 화면
| 회원가입 및 기숙사 선택 | 메인 게시판 | 실시간 채팅방 |
| :---: | :---: | :---: |
| ![회원가입](https://github.com/user-attachments/assets/이미지_링크_넣기) | ![메인](https://github.com/user-attachments/assets/이미지_링크_넣기) | ![채팅](https://github.com/user-attachments/assets/이미지_링크_넣기) |
[cite_start][cite: 335, 410, 409]

