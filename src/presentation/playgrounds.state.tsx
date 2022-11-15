import { useState } from "react";
import { container } from "tsyringe";
import UsecaseResponse from "../common/usecase/usecase_response";
import PlaygroundEntity from "../domain/entities/playground.entity";
import ListAllPlaygroundsUsecase from "../domain/usecases/listAllPlaygrounds/list_all_playgrounds.usecase";

export interface PlaygroundsState {
  error: Error | null;
  getAllPlaygrounds: () => void;
  isLoading: boolean;
  playgrounds: PlaygroundEntity[] | null;
}
const createPlaygroundsState = (): PlaygroundsState => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [playgrounds, setPlaygrounds] = useState<PlaygroundEntity[] | null>(
    null
  );

  const getAllPlaygrounds = async () => {
    setLoading(true);
    const usecase: ListAllPlaygroundsUsecase = container.resolve(
      ListAllPlaygroundsUsecase
    );
    try {
      const usecaseResponse: UsecaseResponse<PlaygroundEntity[]> =
        await usecase.call();
      if (usecaseResponse.result) {
        setError(null);
        setPlaygrounds(usecaseResponse.result);
      } else {
        setError(usecaseResponse.error);
        setPlaygrounds(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return { error, getAllPlaygrounds, isLoading, playgrounds };
};

export default createPlaygroundsState;
