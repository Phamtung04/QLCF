import { Method } from 'axios';

interface IBindingDetail {
    static: any;
    method: Method | 'EXEC';
    remote: string;
    behavior: 'default' | 'set' | any;
}

interface IAction {
    bindings:
        | {
              [name: string]: IBindingDetail;
          }
        | any;
    lbl: string;
    permissions: any[];
    piplines: string[];
    behavior: string;
    formId: string;
}

interface IWorkflow {
    id: string | any;
    name: string | any;
    description: string | any;
    steps: IStepWorkflow[];
}

interface IStepWorkflow {
    actions:
        | {
              [name: string]: IAction;
          }
        | any;
    done: string[];
    id: string;
    name: string;
    nextStepId: string | null;
    prevStepId: string | null;
    scripts: string[] | null;
}

export type { IWorkflow, IStepWorkflow, IAction, IBindingDetail };
