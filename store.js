/*
  데이터 저장 추상화 계층.
  현재: LocalTripStore (현재 브라우저의 localStorage만 사용)
  향후: 동일 메서드(init/read/save/subscribe)를 갖는 FirebaseTripStore로 교체 가능
  주의: GitHub Pages에 올렸다고 부부 간 데이터가 자동 동기화되지 않습니다.
*/
(function () {
  'use strict';
  const STORAGE_KEY = 'phuquoc-family-trip:v1'; // 기존 v1/v2 저장 정보를 유지합니다.
  const LEGACY_GROUPS = [
    {id:'before',title:'출발 전 할 일'},
    {id:'packing',title:'짐 챙기기'},
    {id:'during',title:'현지에서'}
  ];

  // v1/v2 백업과 localStorage 데이터를 새 탭 형식으로 자동 보완합니다.
  function normalizeState(value) {
    if (!value || typeof value !== 'object') return value;
    const data = JSON.parse(JSON.stringify(value));
    if (!Array.isArray(data.taskGroups)) {
      data.taskGroups = LEGACY_GROUPS.map((group) => ({...group}));
    }
    if (Array.isArray(data.tasks)) {
      const seen = new Set(data.taskGroups.map((group) => group.id));
      data.tasks.forEach((task) => {
        if (typeof task.group !== 'string' || !task.group.trim()) task.group='before';
        if (!seen.has(task.group)) {
          const legacy = LEGACY_GROUPS.find((group) => group.id === task.group);
          data.taskGroups.push({id:task.group,title:legacy?.title || '이전 분류'});
          seen.add(task.group);
        }
      });
    }
    return data;
  }

  function freshData() {
    return normalizeState(window.TripInitialData);
  }
  function validState(raw) {
    const value = normalizeState(raw);
    return value && typeof value === 'object' && value.schemaVersion === 1 &&
      value.trip && typeof value.trip.title === 'string' &&
      typeof value.trip.startDate === 'string' && typeof value.trip.endDate === 'string' &&
      ['plans', 'bookings', 'places', 'tasks'].every((key) => Array.isArray(value[key]) &&
        value[key].length <= 2000 &&
        value[key].every((item) => item && typeof item === 'object' &&
          typeof item.id === 'string' && typeof item.title === 'string')) &&
      Array.isArray(value.taskGroups) && value.taskGroups.length >= 1 && value.taskGroups.length <= 30 &&
      value.taskGroups.every((group) => group && typeof group.id === 'string' &&
        group.id.length > 0 && group.id.length <= 80 &&
        typeof group.title === 'string' && group.title.trim().length > 0 && group.title.length <= 25) &&
      new Set(value.taskGroups.map((group) => group.id)).size === value.taskGroups.length &&
      value.tasks.every((task) => typeof task.group === 'string' &&
        value.taskGroups.some((group) => group.id === task.group)) &&
      value.plans.every((p) => typeof p.date === 'string') &&
      value.bookings.every((b) => typeof b.startDate === 'string' &&
        (b.endDate == null || typeof b.endDate === 'string'));
  }

  class LocalTripStore {
    constructor() {
      this.data = freshData();
      this.listeners = new Set();
      this.persistent = true;
      this.boundStorage = (event) => {
        if (event.key !== STORAGE_KEY) return;
        try {
          const value = event.newValue ? JSON.parse(event.newValue) : freshData();
          if (!validState(value)) return;
          this.data = normalizeState(value);
          this.listeners.forEach((fn) => fn(this.read()));
        } catch (error) {
          console.warn('다른 탭의 변경을 읽을 수 없습니다.', error);
        }
      };
    }
    async init() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const value = JSON.parse(raw);
          if (validState(value)) this.data = normalizeState(value);
        }
      } catch (error) {
        this.persistent = false;
        console.warn('브라우저 저장소 사용 불가: 임시 메모리 모드', error);
      }
      window.addEventListener('storage', this.boundStorage);
      return this.read();
    }
    read() { return JSON.parse(JSON.stringify(this.data)); }
    async save(nextData) {
      if (!validState(nextData)) throw new Error('잘못된 여행 데이터 형식입니다.');
      this.data = normalizeState(nextData);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch (error) {
        this.persistent = false;
        console.warn('저장 실패: 임시 메모리에는 반영되었습니다.', error);
      }
      this.listeners.forEach((fn) => fn(this.read()));
      return this.read();
    }
    subscribe(fn) {
      this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    }
  }

  window.TripStore = { LocalTripStore, freshData, validState, normalizeState, STORAGE_KEY };
})();
