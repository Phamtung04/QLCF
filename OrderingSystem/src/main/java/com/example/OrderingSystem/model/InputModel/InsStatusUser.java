package com.example.OrderingSystem.model.InputModel;

public class InsStatusUser extends InsRID {
    private boolean lockUp;

    public boolean isLockUp() {
        return lockUp;
    }

    public void setLockUp(boolean lockUp) {
        this.lockUp = lockUp;
    }
}
