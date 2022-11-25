import { useState } from "react";
import { container } from "tsyringe";
import UsecaseResponse from "../common/usecase/usecase_response";
import PlaygroundEntity from "../domain/entities/playground.entity";
import TestedPlaygroundEntity from "../domain/entities/testedplayground.entity";
import AddPlaygroundInfoUsecase from "../domain/usecases/addPlaygroundInfo/add_playground_info.usecase";
import ListAllPlaygroundsUsecase from "../domain/usecases/listAllPlaygrounds/list_all_playgrounds.usecase";

function usePlaygroundState() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [playgroundInfo, setPlaygroundInfo] =
    useState<TestedPlaygroundEntity | null>(null);
  const [allPlaygrounds, setAllPlaygrounds] = useState<
    PlaygroundEntity[] | null
  >(null);

  const addPlaygroundInfo = async (params: {
    playgroundId: string;
    userId: string;
    comment: string;
    rate: number;
  }): Promise<void> => {
    const addPlaygroundInfoUsecase = container.resolve(
      AddPlaygroundInfoUsecase
    );
    setLoading(true);
    const response: UsecaseResponse<TestedPlaygroundEntity> =
      await addPlaygroundInfoUsecase.call({
        playgroundId: params.playgroundId,
        userId: params.userId,
        rate: params.rate,
        comment: params.comment,
        gamesId: [],
      });
    setLoading(false);
    if (response.error) {
      setError(response.error);
      setPlaygroundInfo(null);
    } else {
      setError(null);
      setPlaygroundInfo(response.result);
    }
  };

  const getAllPlaygrounds = async (): Promise<void> => {
    setLoading(true);
    const usecase: ListAllPlaygroundsUsecase = container.resolve(
      ListAllPlaygroundsUsecase
    );
    const result = await usecase.call();
    if (result.error) {
      setError(result.error);
      setAllPlaygrounds(null);
    } else {
      setError(null);
      setAllPlaygrounds(result.result);
    }
    setLoading(false);
  };

  return {
    isLoading,
    error,
    playgroundInfo,
    allPlaygrounds,
    addPlaygroundInfo,
    getAllPlaygrounds,
  };
}

export default usePlaygroundState;
