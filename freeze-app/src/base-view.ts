import { LitElement } from "lit";
import { property } from "lit/decorators.js";

export interface Course {
  id: string;
  serial: string;
  is_admin: string;
  name: string;
}

export class BaseView extends LitElement {
  subscribedTo?: Element;
  courseChangedListener: EventListener;

  @property({ attribute: false })
  courses: Array<Course> = [];

  constructor() {
    super();
    this.courseChangedListener = ((e: CustomEvent) => {
      this.handleCourseChange(e);
    }) as EventListener;
  }

  createRenderRoot() {
    return this;
  }

  private subscribe(e: Element, courses: Array<Course>) {
    this.subscribedTo = e;
    this.courses = courses;
    this.subscribedTo.addEventListener(
      "course-changed",
      this.courseChangedListener
    );
  }

  private handleCourseChange(e: CustomEvent) {
    this.courses = e.detail;
  }

  connectedCallback() {
    super.connectedCallback();
    const options = {
      detail: (e: Element, courses: Array<Course>) => {
        this.subscribe(e, courses);
      },
      bubbles: true,
    };
    this.dispatchEvent(new CustomEvent("subscribe", options));
  }

  disconnectedCallback() {
    this.subscribedTo?.removeEventListener(
      "course-changed",
      this.courseChangedListener
    );
  }
}
